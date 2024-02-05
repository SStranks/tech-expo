import { EslintConfig, ConfigPrettier } from '@packages/eslint-config';
import { EslintConfigCypress } from '@packages/eslint-config-cypress';
import { EslintConfigExpress } from '@packages/eslint-config-express';
import { EslintConfigReact } from '@packages/eslint-config-react';
import { EslintConfigReactTest } from '@packages/eslint-config-react-test';
import { EslintConfigStorybook } from '@packages/eslint-config-storybook';

export default [
  ConfigPrettier,
  {
    ignores: ['**/node_modules', '**/dist', '**/build', '**/__snapshots__', '**/mocks', '**/coverage', '**/.sassdoc'],
  },
  {
    // Client; src folder. React framework.
    files: ['apps/*/+(frontend|client)/src/*.[jt]s?(x)'],
    languageOptions: { ...EslintConfig.languageOptions, ...EslintConfigReact.languageOptions },
    plugins: { ...EslintConfig.plugins, ...EslintConfigReact.plugins },
    rules: { ...EslintConfig.rules, ...EslintConfigReact.rules },
    settings: { ...EslintConfig.settings, ...EslintConfigReact.settings },
  },
  {
    // Server; src folder. NodeJS Express + Testing (Node)
    files: ['apps/*/+(backend|server)/src/*.[jt]s'],
    languageOptions: { ...EslintConfig.languageOptions, ...EslintConfigExpress.languageOptions },
    plugins: { ...EslintConfig.plugins, ...EslintConfigExpress.plugins },
    rules: { ...EslintConfig.rules, ...EslintConfigExpress.rules },
    settings: { ...EslintConfig.settings, ...EslintConfigExpress.settings },
  },
  {
    // Client; Testing (Jest + RTL)
    files: ['apps/*/+(frontend|client)/src/?(*.)+(spec|test).[jt]s?(x)'],
    languageOptions: { ...EslintConfig.languageOptions, ...EslintConfigReact.languageOptions },
    plugins: { ...EslintConfig.plugins, ...EslintConfigReact.plugins, ...EslintConfigReactTest.plugins },
    rules: { ...EslintConfig.rules, ...EslintConfigReact.rules, ...EslintConfigReactTest.rules },
    settings: { ...EslintConfig.settings, ...EslintConfigReact.settings },
  },
  {
    // Client; Testing (Cypress)
    files: ['apps/*/+(frontend|client)/cypress/**/?(*.)+(spec|test).[jt]s'],
    languageOptions: { ...EslintConfig.languageOptions, ...EslintConfigCypress.languageOptions },
    plugins: { ...EslintConfig.plugins, ...EslintConfigCypress.plugins },
    rules: { ...EslintConfig.rules, ...EslintConfigCypress.rules },
    settings: { ...EslintConfig.settings, ...EslintConfigCypress.settings },
  },
  {
    // Client; Testing (Storybook)
    files: ['apps/*/+(frontend|client)/.storybook/**/?(*.)+(story|stories).[jt]s?(x)'],
    // ignores: ['!.storybook', 'storybook-static'],
    languageOptions: { ...EslintConfig.languageOptions, ...EslintConfigStorybook.languageOptions },
    plugins: { ...EslintConfig.plugins, ...EslintConfigStorybook.plugins },
    rules: { ...EslintConfig.rules, ...EslintConfigStorybook.rules },
    settings: { ...EslintConfig.settings, ...EslintConfigStorybook.settings },
  },
];
