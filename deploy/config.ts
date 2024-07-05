export enum AppStage {
  BETA = 'beta',
  GAMMA = 'gamma',
  PROD = 'prod',
  TOOLCHAIN = 'toolchain',
}

export const accountIdAlias: Record<AppStage, string> = {
  [AppStage.BETA]: '843407916570', // umccr_development
  [AppStage.GAMMA]: '455634345446', // umccr_staging
  [AppStage.PROD]: '472057503814', // umccr_production
  [AppStage.TOOLCHAIN]: '383856791668', // umccr_production
};

export const REGION = 'ap-southeast-2';
