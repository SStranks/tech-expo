/* eslint-disable perfectionist/sort-objects */
import PluginNode from 'eslint-plugin-n';
// import PluginImport from 'eslint-plugin-import';
import PluginSecurity from 'eslint-plugin-security';
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
      ecmaVersion: 2021,
      requireConfigFile: false,
    },
  },
  plugins: {
    // import: fixupPluginRules(PluginImport),
    n: PluginNode,
    security: PluginSecurity,
  },
  rules: {
    // ...PluginImport.configs.recommended.rules,
    ...PluginSecurity.configs.recommended.rules,
    ...PluginNode.configs['flat/recommended-module'].rules,
    'arrow-body-style': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
    'n/no-missing-import': 'off',
    'n/no-unpublished-import': 'off',
  },
};

export default [EslintConfigExpress];
