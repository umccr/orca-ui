// import * as path from 'path';
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
// import { Architecture, Code, Runtime } from 'aws-cdk-lib/aws-lambda';
import {
  BuildEnvironmentVariableType,
  BuildSpec,
  LinuxArmBuildImage,
  // Project,
  // Source,
} from 'aws-cdk-lib/aws-codebuild';
// import { AwsCliLayer } from 'aws-cdk-lib/lambda-layer-awscli';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CodeBuildStep, IFileSetProducer } from 'aws-cdk-lib/pipelines';
// import { TriggerFunction } from 'aws-cdk-lib/triggers';
// import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { CodePipelineSource } from 'aws-cdk-lib/pipelines';
import { BucketDeployment, Source as S3DeploySource } from 'aws-cdk-lib/aws-s3-deployment';

export type ApplicationStackProps = {
  cloudFrontBucketName: string;
  aliasDomainName: string[];
  reactBuildEnvVariables: Record<string, string>;
  sourceFile: CodePipelineSource;
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

    const distribution = this.setupS3CloudFrontIntegration(clientBucket, props.aliasDomainName);
    this.buildReactApp(clientBucket, distribution, props.reactBuildEnvVariables, props.sourceFile);
  }

  private buildReactApp(
    bucket: IBucket,
    distribution: Distribution,
    reactBuildEnvVariables: Record<string, string>,
    sourceFile: CodePipelineSource
  ) {
    const buildStep = new ReactCodeBuildStep('BuildReactApp', {
      bucketName: bucket.bucketName,
      input: sourceFile,
      reactBuildEnvVariables: reactBuildEnvVariables,
    });

    new BucketDeployment(this, 'DeployReactApp', {
      sources: [S3DeploySource.bucket(bucket, buildStep.projectName || 'ReactBuildCodeBuildStep')],
      destinationBucket: bucket,
      distribution,
      distributionPaths: ['/*'],
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
}

/**
 * Currently is not used!
 * If we decide the build to be in the toolchain (instead of individual) account, this might be handy to put at the post
 * step of each stage account
 */
export class ReactCodeBuildStep extends CodeBuildStep {
  constructor(
    id: string,
    props: {
      bucketName: string;
      input: IFileSetProducer;
      reactBuildEnvVariables: Record<string, string>;
    }
  ) {
    super(id, {
      projectName: 'ReactBuildCodeBuildStep',
      // TODO: remove this once we have a proper runtime for the build
      partialBuildSpec: BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            'runtime-versions': {
              nodejs: 20,
            },
            commands: ['node -v', 'corepack enable', 'yarn --version', 'yarn install --immutable'],
          },
        },
      }),
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
          VITE_REGION: { value: 'ap-southeast-2', type: BuildEnvironmentVariableType.PLAINTEXT },
          ...getSSMEnvironmentVariables(),
          ...Object.entries(props.reactBuildEnvVariables).reduce(
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

const getSSMEnvironmentVariables = () => {
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
};
