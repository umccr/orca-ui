import * as path from 'path';
import {
  OriginAccessIdentity,
  Distribution,
  ViewerProtocolPolicy,
  PriceClass,
  SecurityPolicyProtocol,
  SSLMethod,
} from 'aws-cdk-lib/aws-cloudfront';
import { S3BucketOrigin } from 'aws-cdk-lib/aws-cloudfront-origins';
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
import { AccountPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Trigger } from 'aws-cdk-lib/triggers';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { SOURCE_BUCKET_ARTIFACT_PATH } from '../config';

export type ApplicationStackProps = {
  cloudFrontBucketName: string;
  aliasDomainName: string[];
  reactBuildEnvVariables: Record<string, string>;
};

export class ApplicationStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: ApplicationStackProps &
      StackProps & { sourceBucketName: string; destinationAccountId?: string }
  ) {
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

    if (props.destinationAccountId) {
      clientBucket.grantRead(new AccountPrincipal(props.destinationAccountId));
    }

    const distribution = this.setupS3CloudFrontIntegration(clientBucket, props.aliasDomainName);
    this.buildReactApp(
      clientBucket,
      props.reactBuildEnvVariables,
      distribution,
      props.sourceBucketName
    );
  }

  private buildReactApp(
    bucket: IBucket,
    reactBuildEnvVariables: Record<string, string>,
    distribution: Distribution,
    sourceBucketName: string
  ) {
    const sourceBucket = Bucket.fromBucketName(this, 'SourceBucket', sourceBucketName);

    const project = new Project(this, 'ReactBuildCodeBuildProject', {
      buildSpec: BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            'runtime-versions': {
              nodejs: 20,
            },
            commands: [
              'aws s3 rm s3://${VITE_BUCKET_NAME}/ --recursive',
              'aws s3 sync ./ s3://${VITE_BUCKET_NAME}/${SOURCE_BUCKET_ARTIFACT_PATH} --dryrun',
              'node -v',
              'corepack enable',
              'yarn --version',
              'yarn install --immutable',
            ],
          },
          build: {
            commands: [
              'set -eu',
              'env | grep VITE',
              'yarn build',
              // deploy the react app to s3
              'aws s3 sync ./dist s3://${VITE_BUCKET_NAME}',
              // invalidate the cloudfront cache
              'aws cloudfront create-invalidation --distribution-id ${CLOUDFRONT_DISTRIBUTION_ID} --paths "/*"',
            ],
          },
        },
      }),
      source: Source.s3({ bucket: sourceBucket, path: SOURCE_BUCKET_ARTIFACT_PATH }),
      description: 'Build react app and publish assets to S3',
      environment: { buildImage: LinuxArmBuildImage.AMAZON_LINUX_2_STANDARD_3_0 },
      environmentVariables: {
        VITE_BUCKET_NAME: {
          value: bucket.bucketName,
          type: BuildEnvironmentVariableType.PLAINTEXT,
        },
        SOURCE_BUCKET_ARTIFACT_PATH: {
          value: SOURCE_BUCKET_ARTIFACT_PATH,
          type: BuildEnvironmentVariableType.PLAINTEXT,
        },
        CLOUDFRONT_DISTRIBUTION_ID: {
          value: distribution.distributionId,
          type: BuildEnvironmentVariableType.PLAINTEXT,
        },
        VITE_REGION: {
          value: 'ap-southeast-2',
          type: BuildEnvironmentVariableType.PLAINTEXT,
        },
        // CodeBuild is smart enough to give permission to these ssm parameters
        ...this.getSSMEnvironmentVariables(),
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
    project.addToRolePolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        actions: ['s3:Get*', 's3:List*'],
        resources: [`arn:aws:s3:::${sourceBucketName}`, `arn:aws:s3:::${sourceBucketName}/*`],
      })
    );

    bucket.grantReadWrite(project);
    distribution.grantCreateInvalidation(project);

    const triggerFunction = new Function(this, 'TriggerCodeBuildLambda', {
      code: Code.fromAsset(path.join(__dirname, '..', 'lambda')),
      timeout: Duration.minutes(10),
      handler: 'start_build.handler',
      logRetention: RetentionDays.ONE_WEEK,
      runtime: Runtime.PYTHON_3_12,
      architecture: Architecture.ARM_64,
      memorySize: 1024,
      environment: {
        CODEBUILD_PROJECT_NAME: project.projectName,
      },
      initialPolicy: [
        new PolicyStatement({
          actions: ['codebuild:StartBuild'],
          resources: [project.projectArn],
        }),
      ],
    });

    // Ths Lambda function trigger the CodeBuild project
    new Trigger(this, 'TriggerCodeBuildTrigger', {
      handler: triggerFunction,
      executeAfter: [project],
    });
  }

  private setupS3CloudFrontIntegration(s3Bucket: IBucket, aliasDomainName: string[]): Distribution {
    const hostedZoneName = StringParameter.valueForStringParameter(this, '/hosted_zone/umccr/name');
    const hostedZoneId = StringParameter.valueForStringParameter(this, '/hosted_zone/umccr/id');

    const hostedZone = HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      hostedZoneId: hostedZoneId,
      zoneName: hostedZoneName,
    });

    const certUse1Arn = StringParameter.valueForStringParameter(this, '/orcaui/certificate_arn');
    const certUse1 = Certificate.fromCertificateArn(this, 'SSLCertificateUSE1', certUse1Arn);

    const cloudFrontOAI = new OriginAccessIdentity(this, 'CloudFrontOAI', {
      comment: 'orca-ui OAI',
    });

    const cloudFrontDistribution = new Distribution(this, 'CloudFrontDistribution', {
      defaultBehavior: {
        origin: S3BucketOrigin.withOriginAccessIdentity(s3Bucket, {
          originAccessIdentity: cloudFrontOAI,
        }),
        viewerProtocolPolicy: ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: Duration.minutes(1),
        },
      ],
      defaultRootObject: 'index.html',
      priceClass: PriceClass.PRICE_CLASS_ALL,
      enableIpv6: false,
      certificate: certUse1,
      domainNames: aliasDomainName,
      minimumProtocolVersion: SecurityPolicyProtocol.TLS_V1_2_2021,
      sslSupportMethod: SSLMethod.SNI,
    });

    new ARecord(this, 'CustomDomainAlias', {
      target: RecordTarget.fromAlias(new CloudFrontTarget(cloudFrontDistribution)),
      zone: hostedZone,
      recordName: 'orcaui',
    });

    return cloudFrontDistribution;
  }

  private getSSMEnvironmentVariables() {
    return {
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
    };
  }
}
