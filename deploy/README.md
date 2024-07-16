# OrcaUI Deployment

The IaC for the deployment of IaC is in AWS CDK.

## Overview

The React application is deployed using AWS CloudFront and S3, utilizing a custom subdomain prefixed with `orcaui` and appended with the respective domain name within their AWS account. Deployment is managed within the toolchain (build) account, enabling the stack to be deployed across multiple accounts.

For each account, the React assets are built and then pushed to a designated S3 bucket using AWS CodeBuild and Lambda functions. Specifically, a Lambda function uploads the assets to S3 and subsequently triggers CodeBuild. CodeBuild then compiles the React application and uploads the built assets back to S3.

## Development

Change to the deploy directory

```sh
cd deploy
```

Install the dependencies

```sh
yarn install
```

To deploy the cdk

```sh
yarn cdk deploy
```

To test cdk resources in compliance with `cdk-nag`

```sh
yarn test
```
