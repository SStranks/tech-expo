// https://github.com/dimaMachina/graphql-eslint/blob/master/examples/monorepo/eslint.config.js
import * as PluginGraphQL from '@graphql-eslint/eslint-plugin';

export const EslintConfigGraphQLReact = {
  processor: PluginGraphQL.processors.graphql,
  languageOptions: {
    parser: PluginGraphQL.parser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    '@graphql-eslint': { rules: PluginGraphQL.rules },
  },
};

export const EslintConfigGraphQLNode = {
  languageOptions: {
    parser: PluginGraphQL.parser,
  },
  plugins: {
    '@graphql-eslint': { rules: PluginGraphQL.rules },
  },
  rules: {
    ...PluginGraphQL.configs['schema-recommended'].rules,
  },
};
