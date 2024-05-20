import { EslintConfig, ConfigPrettier } from '@packages/eslint-config';
import { EslintConfigCypress } from '@packages/eslint-config-cypress';
import { EslintConfigExpress } from '@packages/eslint-config-express';
import { EslintConfigReact } from '@packages/eslint-config-react';
import { EslintConfigReactTest } from '@packages/eslint-config-react-test';
// import { EslintConfigStorybook } from '@packages/eslint-config-storybook';

export default [
  {
    // --- Global Ignores
    ignores: ['**/node_modules', '**/dist', '**/build', '**/__snapshots__', '**/mocks', '**/coverage', '**/.sassdoc'],
  },
  {
    // --- Global Configuration
    languageOptions: { ...EslintConfig.languageOptions },
    plugins: { ...EslintConfig.plugins },
    rules: { ...EslintConfig.rules },
    settings: { ...EslintConfig.settings },
  },
  // === INDIVIDUAL PROJECTS ===
  // --- CRM: Client; React + TypeScript
  {
    files: ['apps/crm/client/src/**/*.[jt]s?(x)', 'apps/pnpm-outdated/client/src/*.ts'],
    languageOptions: {
      parserOptions: { project: ['./apps/crm/client/tsconfig.json'] },
      ...EslintConfigReact.languageOptions,
    },
    plugins: { ...EslintConfigReact.plugins },
    rules: { ...EslintConfigReact.rules },
    settings: { ...EslintConfigReact.settings },
  },
  {
    // --- CRM: Client; NodeJS Express + Testing (Node)
    files: ['apps/crm/server/server/**/*.[jt]s'],
    languageOptions: { ...EslintConfigExpress.languageOptions },
    plugins: { ...EslintConfigExpress.plugins },
    rules: { ...EslintConfigExpress.rules },
    settings: { ...EslintConfigExpress.settings },
  },
  {
    // --- CRM: Client; Testing (Jest + RTL)
    files: ['apps/crm/client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
    languageOptions: { ...EslintConfigReact.languageOptions },
    plugins: { ...EslintConfigReact.plugins, ...EslintConfigReactTest.plugins },
    rules: { ...EslintConfigReact.rules, ...EslintConfigReactTest.rules },
    settings: { ...EslintConfigReact.settings },
  },
  {
    // --- CRM: Client; Testing (Cypress)
    files: ['apps/crm/client/cypress/**/?(*.)+(spec|test).[jt]s'],
    languageOptions: { ...EslintConfigCypress.languageOptions },
    plugins: { ...EslintConfigCypress.plugins },
    rules: { ...EslintConfigCypress.rules },
    settings: { ...EslintConfigCypress.settings },
  },
  ConfigPrettier,
];

// === GENERALIZED CATCHALLS ===
// {
//   // Client; src folder. React framework.
//   files: ['apps/*/+(frontend|client)/src/**/*.[jt]s?(x)'],
//   languageOptions: { ...EslintConfigReact.languageOptions },
//   plugins: { ...EslintConfigReact.plugins },
//   rules: { ...EslintConfigReact.rules },
//   settings: { ...EslintConfigReact.settings },
// },
// {
//   // Server; src folder. NodeJS Express + Testing (Node)
//   files: ['apps/*/+(backend|server)/server/**/*.[jt]s'],
//   languageOptions: { ...EslintConfigExpress.languageOptions },
//   plugins: { ...EslintConfigExpress.plugins },
//   rules: { ...EslintConfigExpress.rules },
//   settings: { ...EslintConfigExpress.settings },
// },
// {
//   // Client; Testing (Jest + RTL)
//   files: ['apps/*/+(frontend|client)/src/**/?(*.)+(spec|test).[jt]s?(x)'],
//   languageOptions: { ...EslintConfigReact.languageOptions },
//   plugins: { ...EslintConfigReact.plugins, ...EslintConfigReactTest.plugins },
//   rules: { ...EslintConfigReact.rules, ...EslintConfigReactTest.rules },
//   settings: { ...EslintConfigReact.settings },
// },
// {
//   // Client; Testing (Cypress)
//   files: ['apps/*/+(frontend|client)/cypress/**/?(*.)+(spec|test).[jt]s'],
//   languageOptions: { ...EslintConfigCypress.languageOptions },
//   plugins: { ...EslintConfigCypress.plugins },
//   rules: { ...EslintConfigCypress.rules },
//   settings: { ...EslintConfigCypress.settings },
// },
// {
//   // Client; Testing (Storybook)
//   files: ['apps/*/+(frontend|client)/.storybook/**/?(*.)+(story|stories).[jt]s?(x)'],
//   // ignores: ['!.storybook', 'storybook-static'],
//   languageOptions: { ...EslintConfigStorybook.languageOptions },
//   plugins: { ...EslintConfigStorybook.plugins },
//   rules: { ...EslintConfigStorybook.rules },
//   settings: { ...EslintConfigStorybook.settings },
// },
