#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from './lib/pipeline-stack';
import { accountIdAlias, AppStage, REGION } from './config';

const app = new cdk.App();

new PipelineStack(app, 'OrcaUIPipeline', {
  env: {
    account: accountIdAlias[AppStage.TOOLCHAIN],
    region: REGION,
  },
  tags: {
    'umccr-org:Stack': 'OrcaUIPipeline',
    'umccr-org:Product': 'OrcaUI',
  },
});
