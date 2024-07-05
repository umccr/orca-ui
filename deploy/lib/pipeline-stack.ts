import { Environment, Stack, StackProps, Stage } from 'aws-cdk-lib';
import {
  BuildEnvironmentVariableType,
  ComputeType,
  LinuxArmBuildImage,
} from 'aws-cdk-lib/aws-codebuild';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { ApplicationStack, ApplicationStackProps } from './deploy-stack';
import { accountIdAlias, REGION } from '../config';
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
        primaryOutputDirectory: 'cd/cdk.out',
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
    pipeline.addStage(
      new DeploymentStage(
        this,
        'OrcaUIBeta',
        { cloudFrontBucketName: 'orca-ui-beta-asset-bucket' },
        {
          account: accountIdAlias.beta,
          region: REGION,
        }
      ),
      {
        post: [
          new CodeBuildStep('ReactBuildBeta', {
            commands: [
              'set -eu',
              'env | grep VITE',
              'yarn build',
              // 'aws s3 rm s3://${VITE_BUCKET_NAME}/ --recursive && aws s3 cp ./dist s3://${VITE_BUCKET_NAME}/ --recursive',
            ],
            installCommands: ['yarn install --production=true'],
            buildEnvironment: {
              buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
              environmentVariables: {
                VITE_UMCCR_DOMAIN_NAME: {
                  value: '/hosted_zone/umccr/name',
                  type: BuildEnvironmentVariableType.PARAMETER_STORE,
                },
              },
            },
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
    appStackProps: ApplicationStackProps,
    env: Environment
  ) {
    super(scope, environmentName, { env: env });

    new ApplicationStack(this, 'OrcaUIApp', { env: env, ...appStackProps });
  }
}
