/* eslint-disable perfectionist/sort-objects */
import PluginGraphQL from '@graphql-eslint/eslint-plugin';
// https://github.com/dimaMachina/graphql-eslint/blob/master/examples/monorepo/eslint.config.js

export const EslintConfigGraphQL = {
  processor: PluginGraphQL.processor,
  languageOptions: {
    parser: PluginGraphQL.parser,
  },
  plugins: { '@graphql-eslint': PluginGraphQL },
};

export default [];
