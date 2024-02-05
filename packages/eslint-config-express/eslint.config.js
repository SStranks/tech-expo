import PluginImport from 'eslint-plugin-import';
import PluginSecurity from 'eslint-plugin-security';
import PluginNode from 'eslint-plugin-n';

import ConfigAirBnbBase from 'eslint-config-airbnb-base';

import globals from 'globals';

export const EslintConfigExpress = {
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    globals: {
      ...globals.node,
      ...globals.es2021,
    },
    parserOptions: {
      requireConfigFile: false,
      ecmaVersion: 2021,
    },
  },
  plugins: {
    import: PluginImport,
    security: PluginSecurity,
    n: PluginNode,
  },
  rules: {
    ...ConfigAirBnbBase.rules,
    ...PluginSecurity.configs.recommended.rules,
    ...PluginNode.configs['recommended-module'].rules,
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'no-console': 'off',
    'arrow-body-style': 'off',
    'n/no-missing-import': 'off',
    'n/no-unpublished-import': [
      'error',
      {
        allowModules: ['supertest'],
      },
    ],
  },
};

export default [EslintConfigExpress];
