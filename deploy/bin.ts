#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { PipelineStack } from './lib/pipeline-stack';
import { TOOLCHAIN_ACCOUNT_ID, REGION } from './config';

const app = new cdk.App();

new PipelineStack(app, 'OrcaUIPipeline', {
  env: {
    account: TOOLCHAIN_ACCOUNT_ID,
    region: REGION,
  },
  tags: {
    'umccr-org:Stack': 'OrcaUIPipeline',
    'umccr-org:Product': 'OrcaUI',
  },
});

app.synth();
