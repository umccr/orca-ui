const REGION = import.meta.env.VITE_REGION;
const OAUTH_DOMAIN = `${import.meta.env.VITE_OAUTH_DOMAIN}.auth.${REGION}.amazoncognito.com`;

const config = {
  region: REGION,
  apiEndpoint: {
    metadata: import.meta.env.VITE_METADATA_URL,
    workflow: import.meta.env.VITE_WORKFLOW_URL,
    sequenceRun: import.meta.env.VITE_SEQUENCE_RUN_URL,
    file: import.meta.env.VITE_FILE_URL,
  },
  cognito: {
    REGION: REGION,
    USER_POOL_ID: import.meta.env.VITE_COG_USER_POOL_ID,
    APP_CLIENT_ID: import.meta.env.VITE_COG_APP_CLIENT_ID,
    IDENTITY_POOL_ID: import.meta.env.VITE_COG_IDENTITY_POOL_ID,
    OAUTH: {
      domain: OAUTH_DOMAIN,
      scopes: ['email', 'openid', 'aws.cognito.signin.user.admin', 'profile'],
      redirectSignIn: [import.meta.env.VITE_OAUTH_REDIRECT_IN],
      redirectSignOut: [import.meta.env.VITE_OAUTH_REDIRECT_OUT],
      responseType: 'code' as const,
    },
  },
};

export default config;

export { REGION };
