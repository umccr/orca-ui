import { Environment, Stack, StackProps, Stage } from 'aws-cdk-lib';
import {
  BuildSpec,
  ComputeType,
  LinuxArmBuildImage,
  PipelineProject,
} from 'aws-cdk-lib/aws-codebuild';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { ApplicationStack, ApplicationStackProps } from './application-stack';
import {
  accountIdAlias,
  AppStage,
  getAppStackConfig,
  REGION,
  cloudFrontBucketNameConfig,
  configLambdaNameConfig,
} from '../config';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Pipeline, Artifact } from 'aws-cdk-lib/aws-codepipeline';
import {
  CodeStarConnectionsSourceAction,
  CodeBuildAction,
  ManualApprovalAction,
} from 'aws-cdk-lib/aws-codepipeline-actions';
export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // A connection where the pipeline get its source code
    const codeStarArn = StringParameter.valueForStringParameter(this, 'codestar_github_arn');
    const sourceFile = CodePipelineSource.connection('umccr/orca-ui', 'main', {
      connectionArn: codeStarArn,
    });

    /*
      Infra Pipeline
      This pipeline is used to deploy the infrastructure code to all accounts
      It is triggered by a webhook from the CodeStar connection

      TODO: add custom webhook to path "/deploy", 
      issue related to https://github.com/aws/aws-cdk/issues/10265
    */
    const infraPipeline = new CodePipeline(this, 'InfraPipeline', {
      synth: new CodeBuildStep('CdkSynth', {
        installCommands: ['node -v', 'corepack enable'],
        commands: ['cd deploy', 'yarn install --immutable', 'yarn cdk synth'],
        input: sourceFile,
        primaryOutputDirectory: 'deploy/cdk.out',
        rolePolicyStatements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['sts:AssumeRole'],
            resources: ['*'],
          }),
        ],
      }),
      selfMutation: true,
      crossAccountKeys: true,
      codeBuildDefaults: {
        buildEnvironment: {
          computeType: ComputeType.LARGE,
          buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
          environmentVariables: {
            NODE_OPTIONS: {
              value: '--max-old-space-size=8192',
            },
          },
        },
      },
    });

    /**
     * Deployment to Beta (Dev) account
     */
    const betaConfig = getAppStackConfig(AppStage.BETA);
    infraPipeline.addStage(
      new DeploymentStage(
        this,
        'OrcaUIBeta',
        {
          account: accountIdAlias.beta,
          region: REGION,
        },
        betaConfig
      )
    );

    /**
     * Deployment to Gamma (Staging) account
     */
    const gammaConfig = getAppStackConfig(AppStage.GAMMA);
    infraPipeline.addStage(
      new DeploymentStage(
        this,
        'OrcaUIGamma',
        {
          account: accountIdAlias.gamma,
          region: REGION,
        },
        gammaConfig
      )
      // {
      //   pre: [new ManualApprovalStep('Promote to Gamma (Staging)')],
      // }
    );

    /**
     * Deployment to Prod (Production) account
     */
    const prodConfig = getAppStackConfig(AppStage.PROD);
    infraPipeline.addStage(
      new DeploymentStage(
        this,
        'OrcaUIProd',
        {
          account: accountIdAlias.prod,
          region: REGION,
        },
        prodConfig
      )
      // {
      //   pre: [new ManualApprovalStep('Promote to Prod (Production)')],
      // }
    );

    /**
     * React Build and Deploy Pipeline (independent from infra pipeline)
     * This pipeline is used to build the react app and deploy it to the specified environment
     * It is triggered by a webhook from the CodeStar connection
     *
     * TODO: add custom webhook to be triggered except path "/deploy",
     * issue related to https://github.com/aws/aws-cdk/issues/10265
     */
    const sourceOutput = new Artifact();
    const buildOutput = new Artifact();

    /**
     * Build project
     * This project is used to build the react app, and store the output in a build artifact
     */
    const buildProject = new PipelineProject(this, 'ReactBuildProject', {
      projectName: 'ReactBuildProject',
      description: 'Build react app',
      buildSpec: BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            'runtime-versions': {
              nodejs: 20,
            },
            commands: ['node -v', 'corepack enable', 'yarn --version', 'yarn install --immutable'],
          },
          build: {
            commands: ['set -eu', 'env | grep VITE', 'yarn build'],
          },
        },
        artifacts: {
          files: ['**/**'],
          'base-directory': 'dist/',
        },
      }),
      environment: { buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0 },
    });

    /**
     * Deploy project
     * This project is used to deploy the react app to the specified environment
     * two commands are executed:
     * 1. remove all files in the bucket and sync the build artifact to destination bucket
     * 2. trigger the lambda to update config and invalidate cloudfront cache
     */
    const deployProject = (env: AppStage) => {
      return new PipelineProject(this, `ReactDeployProject${env}`, {
        projectName: `ReactDeployProject${env}`,
        description: 'Deploy react app',
        buildSpec: BuildSpec.fromObject({
          version: 0.2,
          phases: {
            build: {
              commands: [
                // remove all files in the bucket and sync the dist
                'aws s3 rm s3://${DESTINATION_BUCKET_NAME}/ --recursive && aws s3 sync . s3://${DESTINATION_BUCKET_NAME}',
                // trigger the lambda to update config and invalidate cloudfront cache
                'aws lambda invoke --function-name ${CONFIG_LAMBDA_NAME} response.json',
              ],
            },
          },
        }),
        environment: { buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0 },
        environmentVariables: {
          DESTINATION_BUCKET_NAME: {
            value: cloudFrontBucketNameConfig[env],
          },
          CONFIG_LAMBDA_NAME: {
            value: configLambdaNameConfig[env],
          },
        },
      });
    };

    /**
     * React Build and Deploy Pipeline
     */
    new Pipeline(this, 'ReactBuildPipeline', {
      pipelineName: 'ReactBuildPipeline',
      crossAccountKeys: false,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new CodeStarConnectionsSourceAction({
              actionName: 'Source',
              owner: 'umccr',
              repo: 'orca-ui',
              branch: 'main',
              connectionArn: codeStarArn,
              output: sourceOutput,
              triggerOnPush: true,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new CodeBuildAction({
              actionName: 'BuildAndDeploy',
              project: buildProject,
              input: sourceOutput,
              outputs: [buildOutput],
            }),
          ],
        },
        {
          stageName: 'Deploy to Beta',
          actions: [
            new ManualApprovalAction({
              actionName: 'Approval',
              runOrder: 1,
            }),
            new CodeBuildAction({
              actionName: 'Deploy',
              project: deployProject(AppStage.BETA),
              input: buildOutput,
            }),
          ],
        },

        {
          stageName: 'Deploy Satge for Gamma',
          actions: [
            new ManualApprovalAction({
              actionName: 'Approval',
              runOrder: 1,
            }),
            new CodeBuildAction({
              actionName: 'Deploy',
              project: deployProject(AppStage.GAMMA),
              input: buildOutput,
            }),
          ],
        },

        {
          stageName: 'Deploy Satge for Prod',
          actions: [
            new ManualApprovalAction({
              actionName: 'Approval',
              runOrder: 1,
            }),
            new CodeBuildAction({
              actionName: 'Deploy',
              project: deployProject(AppStage.PROD),
              input: buildOutput,
            }),
          ],
        },
      ],
    });
  }
}

class DeploymentStage extends Stage {
  constructor(
    scope: Construct,
    environmentName: string,
    env: Environment,
    appStackProps: ApplicationStackProps
  ) {
    super(scope, environmentName, { env: env });
    new ApplicationStack(this, 'ApplicationStack', {
      env: env,
      tags: {
        'umccr-org:Product': 'OrcaUI',
        'umccr-org:Creator': 'CDK',
      },
      ...appStackProps,
    });
  }
}
