import { EslintConfig, ConfigPrettier } from '@packages/eslint-config';
import { EslintConfigReact } from '@packages/eslint-config-react';
import { EslintConfigReactTest } from '@packages/eslint-config-react-test';
import { EslintConfigExpress } from '@packages/eslint-config-express';

export default [
  ConfigPrettier,
  {
    ignores: ['**/node_modules', '**/dist', '**/build', '**/__snapshots__', '**/mocks', '**/coverage', '**/.sassdoc'],
  },
  {
    // Client - React
    files: [
      'apps/*/frontend/**/*.ts',
      'apps/*/frontend/**/*.tsx',
      'apps/*/frontend/**/*.jsx',
      'apps/*/frontend/**/*.js',
    ],
    languageOptions: { ...EslintConfig.languageOptions, ...EslintConfigReact.languageOptions },
    plugins: { ...EslintConfig.plugins, ...EslintConfigReact.plugins },
    rules: { ...EslintConfig.rules, ...EslintConfigReact.rules },
    settings: { ...EslintConfig.settings, ...EslintConfigReact.settings },
  },
  {
    // API - NodeJS Express + Testing (Jest)
    files: ['apps/*/backend/**/*.ts', 'apps/*/backend/**/*.js'],
    languageOptions: { ...EslintConfig.languageOptions, ...EslintConfigExpress.languageOptions },
    plugins: { ...EslintConfig.plugins, ...EslintConfigExpress.plugins },
    rules: { ...EslintConfig.rules, ...EslintConfigExpress.rules },
    settings: { ...EslintConfig.settings, ...EslintConfigExpress.settings },
  },
  {
    // Client - Testing (Jest + RTL)
    files: ['apps/*/frontend/**/?(*.)+(spec|test).[jt]s?(x)'],
    languageOptions: { ...EslintConfig.languageOptions, ...EslintConfigReact.languageOptions },
    plugins: { ...EslintConfig.plugins, ...EslintConfigReact.plugins, ...EslintConfigReactTest.plugins },
    rules: { ...EslintConfig.rules, ...EslintConfigReact.rules, ...EslintConfigReactTest.rules },
    settings: { ...EslintConfig.settings, ...EslintConfigReact.settings },
  },
];
