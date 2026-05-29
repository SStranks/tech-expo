// @ts-check
import PluginTanstackQuery from '@tanstack/eslint-plugin-query';
import PluginTanstackRouter from '@tanstack/eslint-plugin-router';
import PluginJSXA11Y from 'eslint-plugin-jsx-a11y';
import PluginReact from 'eslint-plugin-react';
import PluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

const EslintConfigReact = {
  languageOptions: {
    ecmaVersion: 2021,
    globals: {
      ...globals.browser,
      ...globals.es2021,
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 2021,
    },
    sourceType: 'module',
  },
  plugins: {
    '@tanstack/query': PluginTanstackQuery,
    '@tanstack/router': PluginTanstackRouter,
    'jsx-a11y': PluginJSXA11Y,
    react: PluginReact,
    'react-hooks': PluginReactHooks,
  },
  rules: {
    ...PluginReact.configs.recommended.rules,
    ...PluginReactHooks.configs.recommended.rules,
    ...PluginJSXA11Y.flatConfigs.recommended.rules,
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/infinite-query-property-order': 'error',
    '@tanstack/query/mutation-property-order': 'error',
    '@tanstack/query/no-rest-destructuring': 'warn',
    '@tanstack/query/no-unstable-deps': 'error',
    '@tanstack/query/no-void-query-fn': 'error',
    '@tanstack/query/stable-query-client': 'error',
    '@tanstack/router/create-route-property-order': 'error',
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
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};

export default EslintConfigReact;
