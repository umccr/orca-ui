import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: [
    {
      'https://mart.prod.umccr.org/graphql': {
        headers: {
          Authorization: process.env.GRAPHQL_SCHEMA_TOKEN ?? '',
        },
      },
    },
  ],
  documents: ['src/modules/orcavault/api/graphql/queries/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './src/modules/orcavault/api/graphql/codegen/': {
      preset: 'client',
      config: {
        documentMode: 'string',
      },
    },
    './src/modules/orcavault/api/graphql/codegen/schema.graphql': {
      plugins: ['schema-ast'],
      config: {
        includeDirectives: true,
      },
    },
  },
};
export default config;
