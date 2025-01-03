import PluginGraphQL from '@graphql-eslint/eslint-plugin';

export default {
  'flat/operations-recommended': PluginGraphQL.configs['flat/operations-recommended'].rules,
  'flat/schema-recommended': PluginGraphQL.configs['flat/schema-recommended'].rules,
};
