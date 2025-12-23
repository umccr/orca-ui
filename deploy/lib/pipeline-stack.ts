import { Environment, Stack, StackProps, Stage } from 'aws-cdk-lib';
import {
  BuildSpec,
  ComputeType,
  LinuxArmBuildImage,
  PipelineProject,
} from 'aws-cdk-lib/aws-codebuild';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import {
  CodeBuildStep,
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
} from 'aws-cdk-lib/pipelines';
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
import {
  AccountPrincipal,
  CompositePrincipal,
  Effect,
  PolicyStatement,
  Role,
  ServicePrincipal,
} from 'aws-cdk-lib/aws-iam';
import { Pipeline, Artifact, CfnPipeline, PipelineType } from 'aws-cdk-lib/aws-codepipeline';
import {
  CodeStarConnectionsSourceAction,
  CodeBuildAction,
  ManualApprovalAction,
} from 'aws-cdk-lib/aws-codepipeline-actions';
export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const ghBranchName = 'main';

    // A connection where the pipeline get its source code
    const codeStarArn = StringParameter.valueForStringParameter(this, 'codestar_github_arn');
    const codeStarSourceActionName = 'infra-src';
    const sourceFile = CodePipelineSource.connection('OrcaBus/orca-ui', ghBranchName, {
      connectionArn: codeStarArn,
      actionName: codeStarSourceActionName,
      triggerOnPush: true,
    });

    const infraCodePipeline = new Pipeline(this, 'InfraCodePipeline', {
      pipelineType: PipelineType.V2,
      pipelineName: 'OrcaUIInfrastructure',
      crossAccountKeys: true,
    });

    // Add event filter to only trigger if the push event is from `deploy` directory
    const infraCfnPipeline = infraCodePipeline.node.defaultChild as CfnPipeline;
    infraCfnPipeline.addPropertyOverride('Triggers', [
      {
        GitConfiguration: {
          Push: [
            {
              Branches: {
                Includes: [ghBranchName],
              },
              FilePaths: {
                Includes: ['deploy/**'],
              },
            },
          ],
          SourceActionName: codeStarSourceActionName,
        },
        ProviderType: 'CodeStarSourceConnection',
      },
    ]);

    const infraCDKPipeline = new CodePipeline(this, 'InfraCDKPipeline', {
      codePipeline: infraCodePipeline,
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
    infraCDKPipeline.addStage(
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
    infraCDKPipeline.addStage(
      new DeploymentStage(
        this,
        'OrcaUIGamma',
        {
          account: accountIdAlias.gamma,
          region: REGION,
        },
        gammaConfig
      ),
      {
        post: [new ManualApprovalStep('Promote to Prod (Production)')],
      }
    );

    /**
     * Deployment to Prod (Production) account
     */
    const prodConfig = getAppStackConfig(AppStage.PROD);
    infraCDKPipeline.addStage(
      new DeploymentStage(
        this,
        'OrcaUIProd',
        {
          account: accountIdAlias.prod,
          region: REGION,
        },
        prodConfig
      )
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
              nodejs: 22,
            },
            commands: ['node -v', 'corepack enable', 'yarn --version', 'yarn install --immutable'],
          },
          build: {
            commands: ['set -eu', 'yarn build'],
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
      const deployProjectRole = new Role(this, `ReactDeployProjectRole${env}`, {
        assumedBy: new CompositePrincipal(
          new ServicePrincipal('codebuild.amazonaws.com'),
          new AccountPrincipal(accountIdAlias[env])
        ),
      });
      // Add a trust relationship to allow the bastion account to assume this role
      deployProjectRole.assumeRolePolicy?.addStatements(
        new PolicyStatement({
          actions: ['sts:AssumeRole'],
          effect: Effect.ALLOW,
          principals: [new AccountPrincipal(this.account)],
        })
      );
      // Grant bucket access permission
      deployProjectRole.addToPolicy(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['s3:Get*', 's3:List*', 's3:PutObject', 's3:DeleteObject'],
          resources: [
            `arn:aws:s3:::${cloudFrontBucketNameConfig[env]}`,
            `arn:aws:s3:::${cloudFrontBucketNameConfig[env]}/*`,
          ],
        })
      );
      // Grant Lambda invoke permission
      deployProjectRole.addToPolicy(
        new PolicyStatement({
          effect: Effect.ALLOW,
          actions: ['lambda:InvokeFunction'],
          resources: [
            `arn:aws:lambda:${REGION}:${accountIdAlias[env]}:function:${configLambdaNameConfig[env]}`,
          ],
        })
      );

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
                'aws lambda invoke --function-name arn:aws:lambda:${REGION}:${DESTINATION_ACCOUNT_ID}:function:${CONFIG_LAMBDA_NAME} response.json',
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
          REGION: {
            value: REGION,
          },
          DESTINATION_ACCOUNT_ID: {
            value: accountIdAlias[env],
          },
        },
        role: deployProjectRole,
      });
    };

    const openApiTsCheck = new PipelineProject(this, 'OpenApiTSCheck', {
      projectName: 'OrcaUI-OpenApiTSCheck',
      description: 'Test artifact with OpenAPI schema from relevant STG stage.',
      buildSpec: BuildSpec.fromObject({
        version: 0.2,
        env: { variables: gammaConfig.reactBuildEnvVariables },
        phases: {
          install: {
            'runtime-versions': {
              nodejs: 20,
            },
            commands: ['node -v', 'corepack enable', 'yarn --version', 'yarn install --immutable'],
          },
          build: {
            commands: ['set -eu', 'make generate-openapi-types', 'yarn tsc-check'],
          },
        },
      }),
      environment: { buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0 },
    });

    /**
     * React Build and Deploy Pipeline
     */
    const codesStarSourceName = 'orcauiAppSrc';
    const appCiCdPipeline = new Pipeline(this, 'OrcaUICodeCICDPipeline', {
      pipelineType: PipelineType.V2,
      pipelineName: 'OrcaUICodeCICDPipeline',
      crossAccountKeys: false,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new CodeStarConnectionsSourceAction({
              actionName: codesStarSourceName,
              owner: 'OrcaBus',
              repo: 'orca-ui',
              branch: ghBranchName,
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
          stageName: 'DeployToBeta',
          actions: [
            new CodeBuildAction({
              actionName: 'DeployToBeta',
              project: deployProject(AppStage.BETA),
              input: buildOutput,
            }),
          ],
        },

        {
          stageName: 'DeployToGamma',
          actions: [
            new CodeBuildAction({
              actionName: 'TSCheckWithStgOpenAPI',
              project: openApiTsCheck,
              input: sourceOutput,
              runOrder: 1,
            }),
            new CodeBuildAction({
              actionName: 'DeployToGamma',
              project: deployProject(AppStage.GAMMA),
              input: buildOutput,
              runOrder: 2,
            }),
            new ManualApprovalAction({
              actionName: 'DeployToProdApproval',
              runOrder: 3,
            }),
          ],
        },

        {
          stageName: 'DeployToProd',
          actions: [
            new CodeBuildAction({
              actionName: 'DeployToProd',
              project: deployProject(AppStage.PROD),
              input: buildOutput,
            }),
          ],
        },
      ],
    });

    // Add event filter to exclude push event from `deploy` folder to trigger the pipeline
    const appCiCdCfnPipeline = appCiCdPipeline.node.defaultChild as CfnPipeline;
    appCiCdCfnPipeline.addPropertyOverride('Triggers', [
      {
        GitConfiguration: {
          Push: [
            {
              Branches: {
                Includes: [ghBranchName],
              },
              FilePaths: {
                Excludes: ['deploy/**'],
              },
            },
          ],
          SourceActionName: codesStarSourceName,
        },
        ProviderType: 'CodeStarSourceConnection',
      },
    ]);
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
