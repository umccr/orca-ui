import * as path from 'path';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Duration, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { Architecture, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  BuildEnvironmentVariableType,
  BuildSpec,
  LinuxArmBuildImage,
  Project,
  Source,
} from 'aws-cdk-lib/aws-codebuild';
import { AwsCliLayer } from 'aws-cdk-lib/lambda-layer-awscli';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CodeBuildStep, IFileSetProducer } from 'aws-cdk-lib/pipelines';
import { TriggerFunction } from 'aws-cdk-lib/triggers';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';

export type ApplicationStackProps = {
  cloudFrontBucketName: string;
  aliasDomainName: string[];
  reactBuildEnvVariables: Record<string, string>;
};

export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps & StackProps) {
    super(scope, id, props);

    const clientBucket = new Bucket(this, 'OrcaUIAssetCloudFrontBucket', {
      bucketName: props.cloudFrontBucketName,
      autoDeleteObjects: true,
      enforceSSL: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    this.setupS3CloudFrontIntegration(clientBucket, props.aliasDomainName);
    this.buildReactApp(clientBucket, props.reactBuildEnvVariables);
  }

  private buildReactApp(bucket: IBucket, reactBuildEnvVariables: Record<string, string>) {
    const artifactBucketPrefix = 'artifact-source';

    // This CodeBuild responsible for building the React app and publish the assets to S3
    const project = new Project(this, 'ReactBuildCodeBuildProject', {
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
            commands: [
              'set -eu',
              'env | grep VITE',
              'yarn build',
              'aws s3 rm s3://${VITE_BUCKET_NAME}/ --recursive && aws s3 sync ./dist s3://${VITE_BUCKET_NAME}',
            ],
          },
        },
      }),
      source: Source.s3({
        bucket: bucket,
        path: `${artifactBucketPrefix}/`,
      }),
      description: 'Build react app and publish assets to S3',
      environment: { buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0 },
      environmentVariables: {
        VITE_BUCKET_NAME: {
          value: bucket.bucketName,
          type: BuildEnvironmentVariableType.PLAINTEXT,
        },
        VITE_REGION: { value: 'ap-southeast-2', type: BuildEnvironmentVariableType.PLAINTEXT },
        // CodeBuild is smart enough to give permission to these ssm parameters
        VITE_COG_APP_CLIENT_ID: {
          value: '/orcaui/cog_app_client_id_stage',
          type: BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        VITE_OAUTH_REDIRECT_IN: {
          value: '/orcaui/oauth_redirect_in_stage',
          type: BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        VITE_OAUTH_REDIRECT_OUT: {
          value: '/orcaui/oauth_redirect_out_stage',
          type: BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        VITE_COG_USER_POOL_ID: {
          value: '/data_portal/client/cog_user_pool_id',
          type: BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        VITE_COG_IDENTITY_POOL_ID: {
          value: '/data_portal/client/cog_identity_pool_id',
          type: BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        VITE_OAUTH_DOMAIN: {
          value: '/data_portal/client/oauth_domain',
          type: BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        VITE_UNSPLASH_CLIENT_ID: {
          value: '/data_portal/unsplash/client_id',
          type: BuildEnvironmentVariableType.PARAMETER_STORE,
        },
        // spread the reactBuildEnvironmentVariables
        ...Object.entries(reactBuildEnvVariables).reduce(
          (acc, [key, value]) => {
            acc[key] = {
              value: value,
              type: BuildEnvironmentVariableType.PLAINTEXT,
            };
            return acc;
          },
          {} as Record<string, Record<string, string>>
        ),
      },
    });
    bucket.grantReadWrite(project);

    // Ths Lambda function upload file to S3 and trigger the CodeBuild project
    // If lambda gets to big, we can use the s3_deployment construct to upload the file to S3
    const triggerCodeBuildLambda = new TriggerFunction(this, 'TriggerCodeBuildLambda', {
      code: Code.fromDockerBuild(path.join(__dirname, '..', '..'), {
        file: 'deploy/lambda/Dockerfile',
        imagePath: 'app/output',
      }),
      timeout: Duration.minutes(10),
      handler: 'start_build.handler',
      logRetention: RetentionDays.ONE_WEEK,
      runtime: Runtime.PYTHON_3_12,
      architecture: Architecture.ARM_64,
      memorySize: 1024,
      environment: {
        CODEBUILD_PROJECT_NAME: project.projectName,
        ARTIFACT_SOURCE_PREFIX: artifactBucketPrefix,
        TARGET_BUCKET: bucket.bucketName,
      },
      layers: [new AwsCliLayer(this, 'AwsCliLayer')],
      initialPolicy: [
        new PolicyStatement({
          actions: ['codebuild:StartBuild'],
          resources: [project.projectArn],
        }),
      ],
      executeAfter: [project],
    });
    bucket.grantReadWrite(triggerCodeBuildLambda);
  }

  private setupS3CloudFrontIntegration(s3Bucket: IBucket, aliasDomainName: string[]) {
    const hostedZoneName = StringParameter.valueForStringParameter(this, '/hosted_zone/umccr/name');
    const hostedZoneId = StringParameter.valueForStringParameter(this, '/hosted_zone/umccr/id');

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: hostedZoneId,
      zoneName: hostedZoneName,
    });

    const certUse1Arn = StringParameter.valueForStringParameter(this, '/orcaui/certificate_arn');
    const certUse1 = Certificate.fromCertificateArn(this, 'SSLCertificateUSE1', certUse1Arn);

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, 'CloudFrontOAI', {
      comment: 'orca-ui OAI',
    });

    const originConfigs: cloudfront.SourceConfiguration = {
      s3OriginSource: {
        s3BucketSource: s3Bucket,
        originAccessIdentity: cloudFrontOAI,
      },
      behaviors: [{ isDefaultBehavior: true }],
    };

    const errorPageConfiguration: cloudfront.CfnDistribution.CustomErrorResponseProperty = {
      errorCode: 403,
      errorCachingMinTtl: 60,
      responseCode: 200,
      responsePagePath: '/index.html',
    };

    const cloudFrontDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      'CloudFrontDistribution',
      {
        originConfigs: [originConfigs],
        errorConfigurations: [errorPageConfiguration],
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        defaultRootObject: 'index.html',
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        enableIpV6: false,
        viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(certUse1, {
          aliases: aliasDomainName,
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_2_2021,
          sslMethod: cloudfront.SSLMethod.SNI,
        }),
      }
    );

    new ARecord(this, 'CustomDomainAlias', {
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
      zone: hostedZone,
      recordName: 'orcaui',
    });
  }
}

/**
 * Currently is not used!
 * If we decide the build to be in the toolchain (instead of individual) account, this might be handy to put at the post
 * step of each stage account
 */
export class ReactCodeBuildStep extends CodeBuildStep {
  constructor(id: string, props: { bucketName: string; input: IFileSetProducer }) {
    super(id, {
      installCommands: ['node -v', 'corepack enable', 'yarn install --immutable'],
      commands: [
        'env | grep VITE',
        'yarn build',
        'aws s3 rm s3://${VITE_BUCKET_NAME}/ --recursive && aws s3 cp ./dist s3://${VITE_BUCKET_NAME}/ --recursive',
      ],
      buildEnvironment: {
        buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0,
        environmentVariables: {
          VITE_BUCKET_NAME: {
            value: props.bucketName,
            type: BuildEnvironmentVariableType.PLAINTEXT,
          },
        },
      },
      input: props.input,
      rolePolicyStatements: [
        new PolicyStatement({
          actions: ['sts:AssumeRole'],
          resources: ['*'],
          conditions: {
            StringEquals: {
              'iam:ResourceTag/aws-cdk:bootstrap-role': 'deploy',
            },
          },
        }),
      ],
    });
  }
}
