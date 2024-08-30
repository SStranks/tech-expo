import { EslintConfig, ConfigPrettier } from '@packages/eslint-config';
import { EslintConfigCypress } from '@packages/eslint-config-cypress';
import { EslintConfigExpress } from '@packages/eslint-config-express';
import { EslintConfigReact as EslintConfigReact_18p2 } from '@packages/eslint-config-react/react-18.2';
import { EslintConfigReactTest } from '@packages/eslint-config-react-test';
import { EslintConfigStorybook } from '@packages/eslint-config-storybook';
// NOTE:  GraphQL; waiting for v4 for flat-config support
// import { EslintConfigGraphQLReact, EslintConfigGraphQLNode } from '@packages/eslint-config-graphql';

export default [
  {
    // --- Global Ignores
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/__snapshots__/',
      '**/mocks/',
      '**/coverage/',
      '**/.sassdoc/',
      '!**/.storybook/',
    ],
  },
  {
    // --- Global Configuration
    languageOptions: { ...EslintConfig.languageOptions },
    plugins: { ...EslintConfig.plugins },
    rules: { ...EslintConfig.rules },
    settings: { ...EslintConfig.settings },
  },
  // === INDIVIDUAL PROJECTS ===
  // --- CRM: Client; React + TypeScript + GraphQL
  {
    files: ['apps/crm/client/src/**/*.[jt]s?(x)', 'apps/pnpm-outdated/client/src/*.ts'],
    // processor: EslintConfigGraphQLReact.processor,
    languageOptions: {
      parserOptions: { project: ['./apps/crm/client/tsconfig.json'] },
      ...EslintConfigReact_18p2.languageOptions,
    },
    plugins: { ...EslintConfigReact_18p2.plugins },
    rules: { ...EslintConfigReact_18p2.rules },
    settings: { ...EslintConfigReact_18p2.settings },
  },
  {
    // --- CRM: Client; Storybook
    files: ['apps/crm/client/src/stories/*.stories.[jt]s?(x)'],
    languageOptions: {
      parserOptions: { project: ['./apps/crm/client/tsconfig.json'] },
    },
    plugins: { ...EslintConfigStorybook.plugins },
    rules: { ...EslintConfigStorybook.rules },
    settings: { ...EslintConfigStorybook.settings },
  },
  {
    // --- CRM: Client; Testing (Jest + RTL)
    files: ['apps/crm/client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
    languageOptions: { ...EslintConfigReact_18p2.languageOptions },
    plugins: { ...EslintConfigReact_18p2.plugins, ...EslintConfigReactTest.plugins },
    rules: { ...EslintConfigReact_18p2.rules, ...EslintConfigReactTest.rules },
    settings: { ...EslintConfigReact_18p2.settings },
  },
  {
    // --- CRM: Client; Testing (Cypress)
    files: ['apps/crm/client/cypress/**/*.cy.[jt]s?(x)'],
    languageOptions: { ...EslintConfigCypress.languageOptions },
    plugins: { ...EslintConfigCypress.plugins },
    rules: { ...EslintConfigCypress.rules },
    settings: { ...EslintConfigCypress.settings },
  },
  {
    // --- CRM: Server; NodeJS Express + Testing (Node)
    files: ['apps/crm/server/src/**/*.[jt]s'],
    languageOptions: { ...EslintConfigExpress.languageOptions },
    plugins: { ...EslintConfigExpress.plugins },
    rules: { ...EslintConfigExpress.rules },
    settings: { ...EslintConfigExpress.settings },
  },
  // {
  //   // --- CRM: Server; GraphQL
  //   files: ['apps/crm/server/src/**/*.{graphql,gql}'],
  //   languageOptions: {
  //     ...EslintConfigGraphQLNode.languageOptions,
  //     parserOptions: {
  //       schema: 'apps/crm/server/src/graphql/schema.graphql',
  //     },
  //   },
  //   plugins: { ...EslintConfigGraphQLNode.plugins },
  //   rules: { ...EslintConfigGraphQLNode.rules },
  // },
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
