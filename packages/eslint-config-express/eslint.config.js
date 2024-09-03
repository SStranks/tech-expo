// import PluginImport from 'eslint-plugin-import';
import PluginSecurity from 'eslint-plugin-security';
import PluginNode from 'eslint-plugin-n';

import globals from 'globals';

// NOTE:  PluginImport currently not working with flat-config

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
    // import: fixupPluginRules(PluginImport),
    security: PluginSecurity,
    n: PluginNode,
  },
  rules: {
    // ...PluginImport.configs.recommended.rules,
    ...PluginSecurity.configs.recommended.rules,
    ...PluginNode.configs['flat/recommended-module'].rules,
    'no-unused-vars': 'off',
    'no-console': 'off',
    'arrow-body-style': 'off',
    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',
  },
};

export default [EslintConfigExpress];
