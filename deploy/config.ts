export enum AppStage {
  BETA = 'beta',
  GAMMA = 'gamma',
  PROD = 'prod',
}

export const TOOLCHAIN_ACCOUNT_ID = '383856791668'; // umccr_bastion

export const accountIdAlias: Record<AppStage, string> = {
  [AppStage.BETA]: '843407916570', // umccr_development
  [AppStage.GAMMA]: '455634345446', // umccr_staging
  [AppStage.PROD]: '472057503814', // umccr_production
};

export const REGION = 'ap-southeast-2';

export const cloudFrontBucketNameConfig: Record<AppStage, string> = {
  [AppStage.BETA]: 'orcaui-cloudfront-843407916570',
  [AppStage.GAMMA]: 'orcaui-cloudfront-455634345446',
  [AppStage.PROD]: 'orcaui-cloudfront-472057503814',
};

export const getAppStackConfig = (appStage: AppStage) => {
  switch (appStage) {
    case AppStage.BETA:
      return {
        cloudFrontBucketName: cloudFrontBucketNameConfig[appStage],
        aliasDomainName: ['orcaui.dev.umccr.org'],
        reactBuildEnvVariables: {
          VITE_METADATA_URL: `https://metadata.dev.umccr.org`,
          VITE_WORKFLOW_URL: `https://workflow.dev.umccr.org`,
          VITE_SEQUENCE_RUN_URL: `https://sequence.dev.umccr.org`,
          VITE_FILE_URL: `https://file.dev.umccr.org`,
        },
      };

    case AppStage.GAMMA:
      return {
        cloudFrontBucketName: cloudFrontBucketNameConfig[appStage],
        aliasDomainName: ['orcaui.stg.umccr.org'],
        reactBuildEnvVariables: {
          VITE_METADATA_URL: `https://metadata.stg.umccr.org`,
          VITE_WORKFLOW_URL: `https://workflow.stg.umccr.org`,
          VITE_SEQUENCE_RUN_URL: `https://sequence.stg.umccr.org`,
          VITE_FILE_URL: `https://file.stg.umccr.org`,
        },
      };

    case AppStage.PROD:
      return {
        cloudFrontBucketName: cloudFrontBucketNameConfig[appStage],
        aliasDomainName: ['orcaui.umccr.org', 'orcaui.prod.umccr.org'],
        reactBuildEnvVariables: {
          VITE_METADATA_URL: `https://metadata.prod.umccr.org`,
          VITE_WORKFLOW_URL: `https://workflow.prod.umccr.org`,
          VITE_SEQUENCE_RUN_URL: `https://sequence.prod.umccr.org`,
          VITE_FILE_URL: `https://file.prod.umccr.org`,
        },
      };
  }
};
