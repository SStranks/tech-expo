/* eslint-disable perfectionist/sort-objects */
import PluginGraphQL from '@graphql-eslint/eslint-plugin';
// https://github.com/dimaMachina/graphql-eslint/blob/master/examples/monorepo/eslint.config.js

export const EslintConfigGraphQL = {
  processor: PluginGraphQL.processor,
  languageOptions: {
    parser: PluginGraphQL.parser,
  },
  plugins: { '@graphql-eslint': PluginGraphQL },
  rules: {
    client: { ...PluginGraphQL.configs['flat/operations-recommended'].rules },
    server: {
      ...PluginGraphQL.configs['flat/schema-recommended'].rules,
      '@graphql-eslint/strict-id-in-types': ['error', { acceptedIdTypes: ['ID', 'UUID'] }],
    },
  },
};

export default [];
