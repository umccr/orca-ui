import { Environment, Stack, StackProps, Stage } from 'aws-cdk-lib';
import { ComputeType, LinuxArmBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { ApplicationStack, ApplicationStackProps, ReactCodeBuildStep } from './deploy-stack';
import { accountIdAlias, AppStage, getAppStackConfig, REGION } from '../config';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // A connection where the pipeline get its source code
    const codeStarArn = StringParameter.valueForStringParameter(this, 'codestar_github_arn');
    const sourceFile = CodePipelineSource.connection('umccr/orca-ui', 'feature/init-iac', {
      connectionArn: codeStarArn,
    });

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new CodeBuildStep('CdkSynth', {
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
    pipeline.addStage(
      new DeploymentStage(
        this,
        'OrcaUIBeta',
        {
          account: accountIdAlias.beta,
          region: REGION,
        },
        betaConfig
      ),
      {
        post: [
          new ReactCodeBuildStep('BuildReactApp', {
            bucketName: betaConfig.cloudFrontBucketName,
            input: sourceFile,
          }),
        ],
      }
    );
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
    new ApplicationStack(this, 'OrcaUIApp', {
      env: env,
      tags: {
        'umccr-org:Product': 'OrcaUI',
        'umccr-org:Creator': 'CDK',
      },
      ...appStackProps,
    });
  }
}
