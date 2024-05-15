import PluginReact from 'eslint-plugin-react';
import PluginReactHooks from 'eslint-plugin-react-hooks';
import PluginJSXA11Y from 'eslint-plugin-jsx-a11y';
import ConfigAirBnb from 'eslint-config-airbnb';
import ConfigAirBnbTypescript from 'eslint-config-airbnb-typescript';
// NOTE:  @tanstack/eslint-plugin-query is not flatconfig compatible yet.
import { configs as ReactQueryConfigs, rules as ReactQueryRules } from '@tanstack/eslint-plugin-query';

import globals from 'globals';

const { extends: airbnbtypescriptRules, ...airbibConfig } = ConfigAirBnbTypescript;

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
    '@tanstack/eslint-plugin-query': { rules: ReactQueryRules, configs: ReactQueryConfigs },
  },
  rules: {
    ...ConfigAirBnb.rules,
    ...ConfigAirBnbTypescript.rules,
    ...PluginReact.configs.recommended.rules,
    ...PluginReactHooks.configs.recommended.rules,
    ...PluginJSXA11Y.configs.recommended.rules,
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
    '@tanstack/eslint-plugin-query/exhaustive-deps': 'error',
    '@tanstack/eslint-plugin-query/no-rest-destructuring': 'warn',
    '@tanstack/eslint-plugin-query/stable-query-client': 'error',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};

export default [EslintConfigReact];
