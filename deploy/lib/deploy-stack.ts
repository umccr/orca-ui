import { CustomResource, Duration, RemovalPolicy, Size, Stack, StackProps } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { BlockPublicAccess, Bucket, IBucket } from 'aws-cdk-lib/aws-s3';
import { StringParameter } from 'aws-cdk-lib/aws-ssm';
import { Construct } from 'constructs';
import { Provider } from 'aws-cdk-lib/custom-resources';
import * as path from 'path';
import { Architecture, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
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

export type ApplicationStackProps = {
  cloudFrontBucketName: string;
  aliasDomainName: string[];
};

export class ApplicationStack extends Stack {
  constructor(scope: Construct, id: string, props: ApplicationStackProps & StackProps) {
    super(scope, id, props);

    const clientBucket = new Bucket(this, 'OrcaUIAssetCloudFrontBucket', {
      bucketName: props.cloudFrontBucketName,
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
    });

    this.setupS3CloudFrontIntegration(clientBucket, props.aliasDomainName);

    // this.buildReactApp(clientBucket);
  }

  private buildReactApp(bucket: IBucket) {
    const project = new Project(this, 'ReactBuildCodeBuildProject', {
      buildSpec: BuildSpec.fromSourceFilename('buildspec.yml'),
      source: Source.gitHub({
        owner: 'umccr',
        repo: 'orca-ui',
        cloneDepth: 1,
      }),
      description: 'Build react app and publish assets to S3',
      environmentVariables: {
        VITE_BUCKET_NAME: {
          value: bucket.bucketName,
          type: BuildEnvironmentVariableType.PLAINTEXT,
        },
        // CodeBuild is smart enough to give permission to these ssm parameters
        VITE_HOSTED_ID: {
          value: '/hosted_zone/umccr/name',
          type: BuildEnvironmentVariableType.PARAMETER_STORE,
        },
      },
    });

    bucket.grantReadWrite(project);
    bucket.grantDelete(project);

    const triggerCodeBuildLambda = new Function(this, 'TriggerCodeBuildLambda', {
      code: Code.fromAsset(path.join(__dirname)),
      timeout: Duration.minutes(10),
      handler: 'start_build.handler',
      runtime: Runtime.PYTHON_3_12,
      architecture: Architecture.ARM_64,
      memorySize: 2048,
      ephemeralStorageSize: Size.mebibytes(1024),
      environment: { CODEBUILD_PROJECT_NAME: project.projectName },
      layers: [new AwsCliLayer(this, 'AwsCliLayer')],
    });
    triggerCodeBuildLambda.addToRolePolicy(
      new PolicyStatement({
        actions: ['codebuild:StartBuild'],
        resources: [project.projectArn], // Ensure you use the ARN of the CodeBuild project
      })
    );

    const provider = new Provider(this, 'Provider', {
      onEventHandler: triggerCodeBuildLambda,
    });

    new CustomResource(this, 'CustomResource', {
      serviceToken: provider.serviceToken,
    });
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

    const cloudFrontOAI = new cloudfront.OriginAccessIdentity(this, 'cloudFrontOAI', {
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
          securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1,
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
