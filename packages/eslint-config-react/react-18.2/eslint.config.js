import PluginReact from 'eslint-plugin-react';
import PluginReactHooks from 'eslint-plugin-react-hooks';
import PluginJSXA11Y from 'eslint-plugin-jsx-a11y';
import PluginQuery from '@tanstack/eslint-plugin-query';

import globals from 'globals';

export const EslintConfigReact = {
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    globals: {
      ...globals.browser,
      ...globals.es2021,
    },
    parserOptions: {
      requireConfigFile: false,
      ecmaVersion: 2021,
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
  plugins: {
    react: PluginReact,
    'react-hooks': PluginReactHooks,
    'jsx-a11y': PluginJSXA11Y,
    '@tanstack/query': PluginQuery,
  },
  rules: {
    ...PluginReact.configs.recommended.rules,
    ...PluginReactHooks.configs.recommended.rules,
    ...PluginJSXA11Y.flatConfigs.recommended.rules,
    ...PluginQuery.configs['flat/recommended'].rules,
    'react/function-component-definition': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/jsx-uses-react': 0,
    'react/prop-types': 0,
    'react/react-in-jsx-scope': 0,
    'react/require-default-props': 0,
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/no-rest-destructuring': 'warn',
    '@tanstack/query/stable-query-client': 'error',
  },
  settings: {
    react: {
      version: '18.2',
    },
  },
};

export default [EslintConfigReact];
