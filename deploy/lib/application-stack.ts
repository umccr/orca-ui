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
// import { BuildEnvironmentVariableType } from 'aws-cdk-lib/aws-codebuild';
import { AccountPrincipal } from 'aws-cdk-lib/aws-iam';
import { RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Function } from 'aws-cdk-lib/aws-lambda';
import { TOOLCHAIN_ACCOUNT_ID } from '../config';

export type ApplicationStackProps = {
  cloudFrontBucketName: string;
  configLambdaName: string;
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

    const distribution = this.setupS3CloudFrontIntegration(clientBucket, props.aliasDomainName);

    /*
      Trigger CodeBuild pipeline to build and deploy the react app
      This lambda function has 3 stages:
      1. read all env variables from os environment variables
      2. write into env.js, upload to the S3 bucket
      3. invalidate the CloudFront cache
    */

    const configLambda = new Function(this, 'EnvConfigLambda', {
      functionName: props.configLambdaName,
      code: Code.fromAsset(path.join(__dirname, '..', 'lambda')),
      timeout: Duration.minutes(10),
      handler: 'env_config.handler',
      logRetention: RetentionDays.ONE_WEEK,
      runtime: Runtime.PYTHON_3_12,
      architecture: Architecture.ARM_64,
      memorySize: 1024,
      environment: {
        VITE_REGION: 'ap-southeast-2',
        BUCKET_NAME: clientBucket.bucketName,
        CLOUDFRONT_DISTRIBUTION_ID: distribution.distributionId,
        ...props.reactBuildEnvVariables,
      },
    });

    clientBucket.grantReadWrite(configLambda);
    distribution.grantCreateInvalidation(configLambda);

    const ssmParameterNames = [
      '/orcaui/cog_app_client_id_stage',
      '/orcaui/oauth_redirect_in_stage',
      '/orcaui/oauth_redirect_out_stage',
      '/data_portal/client/cog_user_pool_id',
      '/data_portal/client/cog_identity_pool_id',
      '/data_portal/unsplash/client_id',
      '/data_portal/client/oauth_domain',
    ];

    ssmParameterNames.forEach((name, index) => {
      const ssmParameter = StringParameter.fromStringParameterName(
        this,
        `SSMParameter${index}`,
        name
      );
      ssmParameter.grantRead(configLambda);
    });

    /*
      Grant the toolchain account access to the S3 bucket and lambda function
      so that it can invoke the lambda function to trigger the CodeBuild pipeline
    */
    clientBucket.grantDelete(new AccountPrincipal(TOOLCHAIN_ACCOUNT_ID));
    clientBucket.grantReadWrite(new AccountPrincipal(TOOLCHAIN_ACCOUNT_ID));
    configLambda.grantInvoke(new AccountPrincipal(TOOLCHAIN_ACCOUNT_ID));
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

  // private getSSMEnvironmentVariables() {
  // return {
  //   VITE_COG_APP_CLIENT_ID: {
  //     value: '/orcaui/cog_app_client_id_stage',
  //     type: BuildEnvironmentVariableType.PARAMETER_STORE,
  //   },
  //   VITE_OAUTH_REDIRECT_IN: {
  //     value: '/orcaui/oauth_redirect_in_stage',
  //     type: BuildEnvironmentVariableType.PARAMETER_STORE,
  //   },
  //   VITE_OAUTH_REDIRECT_OUT: {
  //     value: '/orcaui/oauth_redirect_out_stage',
  //     type: BuildEnvironmentVariableType.PARAMETER_STORE,
  //   },
  //   VITE_COG_USER_POOL_ID: {
  //     value: '/data_portal/client/cog_user_pool_id',
  //     type: BuildEnvironmentVariableType.PARAMETER_STORE,
  //   },
  //   VITE_COG_IDENTITY_POOL_ID: {
  //     value: '/data_portal/client/cog_identity_pool_id',
  //     type: BuildEnvironmentVariableType.PARAMETER_STORE,
  //   },
  //   VITE_OAUTH_DOMAIN: {
  //     value: '/data_portal/client/oauth_domain',
  //     type: BuildEnvironmentVariableType.PARAMETER_STORE,
  //   },
  //   VITE_UNSPLASH_CLIENT_ID: {
  //     value: '/data_portal/unsplash/client_id',
  //     type: BuildEnvironmentVariableType.PARAMETER_STORE,
  //   },
  // };

  //   return {
  //     VITE_COG_APP_CLIENT_ID: '/orcaui/cog_app_client_id_stage',
  //     VITE_OAUTH_REDIRECT_IN: '/orcaui/oauth_redirect_in_stage',
  //     VITE_OAUTH_REDIRECT_OUT: '/orcaui/oauth_redirect_out_stage',
  //     VITE_COG_USER_POOL_ID: '/data_portal/client/cog_user_pool_id',
  //     VITE_COG_IDENTITY_POOL_ID: '/data_portal/client/cog_identity_pool_id',
  //     VITE_OAUTH_DOMAIN: '/data_portal/client/oauth_domain',
  //     VITE_UNSPLASH_CLIENT_ID: '/data_portal/unsplash/client_id',
  //   };
  // }
}
