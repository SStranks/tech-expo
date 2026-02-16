// @ts-check
/* eslint-disable perfectionist/sort-objects */
import PluginNode from 'eslint-plugin-n';
import globals from 'globals';

const EslintConfigNode = {
  languageOptions: {
    sourceType: 'module',
    globals: {
      ...globals.node,
    },
  },
  plugins: {
    n: PluginNode,
  },
  rules: {
    ...PluginNode.configs['flat/recommended-module'].rules,
    'arrow-body-style': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',
  },
};

export default EslintConfigNode;
