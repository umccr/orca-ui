import { App, Aspects, Stack } from 'aws-cdk-lib';
import { Annotations, Match } from 'aws-cdk-lib/assertions';
import { SynthesisMessage } from 'aws-cdk-lib/cx-api';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { ApplicationStack } from '../lib/application-stack';
import { AppStage, getAppStackConfig } from '../config';

function synthesisMessageToString(sm: SynthesisMessage): string {
  return `${sm.entry.data} [${sm.id}]`;
}

describe('cdk-nag-stack', () => {
  const app: App = new App({});

  const stack = new ApplicationStack(app, 'ApplicationStack', {
    env: {
      account: '123456789',
      region: 'ap-southeast-2',
    },
    tags: {
      'umccr-org:Product': 'OrcaUI',
      'umccr-org:Creator': 'CDK',
    },
    ...getAppStackConfig(AppStage.PROD),
  });

  const stackId = stack.node.id;

  Aspects.of(stack).add(new AwsSolutionsChecks());
  applyNagSuppression(stackId, stack);

  test(`${stackId}: cdk-nag AwsSolutions Pack errors`, () => {
    const errors = Annotations.fromStack(stack)
      .findError('*', Match.stringLikeRegexp('AwsSolutions-.*'))
      .map(synthesisMessageToString);
    expect(errors).toHaveLength(0);
  });

  test(`${stackId}: cdk-nag AwsSolutions Pack warnings`, () => {
    const warnings = Annotations.fromStack(stack)
      .findWarning('*', Match.stringLikeRegexp('AwsSolutions-.*'))
      .map(synthesisMessageToString);
    expect(warnings).toHaveLength(0);
  });
});

/**
 * apply nag suppression according to the relevant stackId
 * @param stackId the stackId
 * @param stack
 */
function applyNagSuppression(stackId: string, stack: Stack) {
  NagSuppressions.addStackSuppressions(
    stack,
    [
      { id: 'AwsSolutions-IAM4', reason: 'allow to use AWS managed policy' },
      { id: 'AwsSolutions-L1', reason: 'allow non latest lambda runtime' },
    ],
    true
  );

  switch (stackId) {
    case 'ApplicationStack':
      NagSuppressions.addResourceSuppressionsByPath(
        stack,
        `/ApplicationStack/CloudFrontDistribution/Resource`,
        [
          {
            id: 'AwsSolutions-CFR1',
            reason: 'Allowing public access without Geo restrictions',
          },
          {
            id: 'AwsSolutions-CFR2',
            reason: 'Disable WAF',
          },
        ]
      );

      NagSuppressions.addResourceSuppressionsByPath(
        stack,
        `/ApplicationStack/EnvConfigLambda/ServiceRole/DefaultPolicy/Resource`,
        [
          {
            id: 'AwsSolutions-IAM5',
            reason: 'The asterisk in the resource ARN is specific only for the CF bucket',
          },
        ]
      );

      NagSuppressions.addResourceSuppressionsByPath(
        stack,
        `/ApplicationStack/OrcaUIAssetCloudFrontBucket/Resource`,
        [
          {
            id: 'AwsSolutions-S1',
            reason: 'No access logs required for now',
          },
        ]
      );

      NagSuppressions.addResourceSuppressionsByPath(
        stack,
        `/ApplicationStack/CloudFrontDistribution/Resource`,
        [
          {
            id: 'AwsSolutions-CFR3',
            reason: 'No access logs required for now',
          },
        ]
      );

      NagSuppressions.addResourceSuppressionsByPath(
        stack,
        `/ApplicationStack/LogRetentionaae0aa3c5b4d4f87b02d85b201efdd8a/ServiceRole/DefaultPolicy/Resource`,
        [
          {
            id: 'AwsSolutions-IAM5',
            reason: 'Allow to use the default log group retention policy',
          },
        ]
      );

      NagSuppressions.addResourceSuppressionsByPath(
        stack,
        `/ApplicationStack/CloudFrontDistribution/Resource`,
        [
          {
            id: 'AwsSolutions-CFR7',
            reason: 'TODO: Convert  origin access identity (OAI) to Origin Access Control (OAC)',
          },
        ]
      );

      break;

    default:
      break;
  }
}
