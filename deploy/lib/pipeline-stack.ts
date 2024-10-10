import { Environment, Stack, StackProps, Stage, RemovalPolicy } from 'aws-cdk-lib';
import { ComputeType, LinuxArmBuildImage } from 'aws-cdk-lib/aws-codebuild';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { CodeBuildStep, CodePipeline, CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { ApplicationStack, ApplicationStackProps } from './application-stack';
import {
  accountIdAlias,
  AppStage,
  getAppStackConfig,
  REGION,
  SOURCE_BUCKET_ARTIFACT_PATH,
  bastionSourceBucketName,
} from '../config';
import { Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { BlockPublicAccess, Bucket } from 'aws-cdk-lib/aws-s3';
import { AccountPrincipal } from 'aws-cdk-lib/aws-iam';

export class PipelineStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    // A connection where the pipeline get its source code
    const codeStarArn = StringParameter.valueForStringParameter(this, 'codestar_github_arn');
    const sourceFile = CodePipelineSource.connection('umccr/orca-ui', 'main', {
      connectionArn: codeStarArn,
    });

    const sourceBucket = new Bucket(this, 'SourceCodeBucket', {
      bucketName: bastionSourceBucketName,
      autoDeleteObjects: true,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    sourceBucket.addToResourcePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:Get*', 's3:List*'],
        principals: [new AccountPrincipal(accountIdAlias.beta)],
        resources: [sourceBucket.arnForObjects('*')],
      })
    );

    const pipeline = new CodePipeline(this, 'Pipeline', {
      synth: new CodeBuildStep('CdkSynthAndCodeCopy', {
        installCommands: ['node -v', 'corepack enable'],
        commands: [
          `aws s3 rm s3://${sourceBucket.bucketName}/${SOURCE_BUCKET_ARTIFACT_PATH} --recursive `,
          `aws s3 sync ./ s3://${sourceBucket.bucketName}/${SOURCE_BUCKET_ARTIFACT_PATH} `,
          'cd deploy',
          'yarn install --immutable',
          'yarn cdk synth',
        ],
        input: sourceFile,
        primaryOutputDirectory: 'deploy/cdk.out',
        rolePolicyStatements: [
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['sts:AssumeRole'],
            resources: ['*'],
          }),
          new PolicyStatement({
            effect: Effect.ALLOW,
            actions: ['s3:*'],
            resources: [sourceBucket.bucketArn],
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
    this.addDeploymentStage(
      pipeline,
      'OrcaUIBeta',
      accountIdAlias.beta,
      betaConfig,
      bastionSourceBucketName,
      accountIdAlias.gamma
    );

    /**
     * Deployment to Gamma (Staging) account
     */
    const gammaConfig = getAppStackConfig(AppStage.GAMMA);
    this.addDeploymentStage(
      pipeline,
      'OrcaUIGamma',
      accountIdAlias.gamma,
      gammaConfig,
      betaConfig.cloudFrontBucketName,
      accountIdAlias.prod
    );

    /**
     * Deployment to Prod (Production) account
     */
    const prodConfig = getAppStackConfig(AppStage.PROD);
    this.addDeploymentStage(
      pipeline,
      'OrcaUIProd',
      accountIdAlias.prod,
      prodConfig,
      gammaConfig.cloudFrontBucketName
    );
  }

  private addDeploymentStage(
    pipeline: CodePipeline,
    stageName: string,
    accountId: string,
    config: ApplicationStackProps,
    sourceBucketName: string,
    destinationAccountId?: string
  ) {
    const stage = new DeploymentStage(
      this,
      stageName,
      { account: accountId, region: REGION },
      { ...config, sourceBucketName, destinationAccountId }
    );
    pipeline.addStage(stage);
  }
}

class DeploymentStage extends Stage {
  constructor(
    scope: Construct,
    environmentName: string,
    env: Environment,
    appStackProps: ApplicationStackProps & {
      sourceBucketName: string;
      destinationAccountId?: string;
    }
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
