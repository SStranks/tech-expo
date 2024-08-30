import * as PluginGraphQL from '@graphql-eslint/eslint-plugin';

export const EslintConfigGraphQL = {
  processor: PluginGraphQL.processors.graphql,
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    '@graphql-eslint': PluginGraphQL,
  },
  // rules: {
  //   ...PluginGraphQL.
  // },
};

export default [EslintConfigGraphQL];
