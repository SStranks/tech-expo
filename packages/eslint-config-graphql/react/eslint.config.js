import * as PluginGraphQL from '@graphql-eslint/eslint-plugin';

export const EslintConfigGraphQLReact = {
  processor: PluginGraphQL.processors.graphql,
  languageOptions: {
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
};

export default [EslintConfigGraphQLReact];
