/* eslint-disable perfectionist/sort-objects */
// import { EslintConfigReactJest } from '@packages/eslint-config-react-jest';
import { ConfigPrettier, EslintConfig } from '@packages/eslint-config';
import { EslintConfigCypress } from '@packages/eslint-config-cypress';
import { EslintConfigExpress } from '@packages/eslint-config-express';
import { EslintConfigGraphQL } from '@packages/eslint-config-graphql';
import { EslintConfigReactVitest } from '@packages/eslint-config-react-vitest';
import { EslintConfigReact as EslintConfigReact_18p2 } from '@packages/eslint-config-react/react-18.2';
import { EslintConfigStorybook } from '@packages/eslint-config-storybook';

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
      '**/*.gen.*',
      '**/graphql/generated/',
      '!**/.storybook/',
      'pnpm-lock.yaml',
    ],
  },
  {
    name: 'Global Configuration',
    languageOptions: { ...EslintConfig.languageOptions },
    plugins: { ...EslintConfig.plugins },
    rules: { ...EslintConfig.rules },
    settings: { ...EslintConfig.settings },
  },
  // === INDIVIDUAL PROJECTS ===
  {
    name: 'CRM: Client; React + TypeScript',
    files: ['apps/crm/client/src/**/*.[jt]s?(x)', 'apps/pnpm-outdated/client/src/*.ts'],
    processor: EslintConfigGraphQL.processor,
    languageOptions: {
      parserOptions: { projectService: true },
      ...EslintConfigReact_18p2.languageOptions,
    },
    plugins: { ...EslintConfigReact_18p2.plugins },
    rules: { ...EslintConfigReact_18p2.rules },
    settings: {
      ...EslintConfigReact_18p2.settings,
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['apps/crm/client/tsconfig.json'],
        },
      },
    },
  },
  {
    name: 'CRM: Client; GraphQL',
    files: ['apps/crm/client/src/**/*.graphql'],
    languageOptions: {
      ...EslintConfigGraphQL.languageOptions,
    },
    plugins: { ...EslintConfigGraphQL.plugins },
    rules: { ...EslintConfigGraphQL.rules.client },
  },
  {
    name: 'CRM: Client; Storybook',
    files: ['apps/crm/client/src/stories/*.stories.[jt]s?(x)'],
    plugins: { ...EslintConfigStorybook.plugins },
    rules: { ...EslintConfigStorybook.rules },
    settings: {
      ...EslintConfigStorybook.settings,
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['apps/crm/client/tsconfig.json'],
        },
      },
    },
  },
  // {
  //   name: 'CRM: Client; Testing (Jest + RTL)',
  //   files: ['apps/crm/client/src/**/?(*.jest.)+(spec|test).[jt]s?(x)'],
  //   languageOptions: { ...EslintConfigReact_18p2.languageOptions },
  //   plugins: { ...EslintConfigReact_18p2.plugins, ...EslintConfigReactJest.plugins },
  //   rules: { ...EslintConfigReact_18p2.rules, ...EslintConfigReactJest.rules },
  //   settings: { ...EslintConfigReact_18p2.settings },
  // },
  {
    name: 'CRM: Client; Testing (Vitest + RTL)',
    files: ['apps/crm/client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
    languageOptions: { ...EslintConfigReact_18p2.languageOptions },
    plugins: { ...EslintConfigReact_18p2.plugins, ...EslintConfigReactVitest.plugins },
    rules: { ...EslintConfigReact_18p2.rules, ...EslintConfigReactVitest.rules },
    settings: {
      ...EslintConfigReact_18p2.settings,
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['apps/crm/client/tsconfig.json'],
        },
      },
    },
  },
  {
    name: 'CRM: Client; Testing (Cypress)',
    files: ['apps/crm/client/cypress/**/*.cy.[jt]s?(x)'],
    languageOptions: { ...EslintConfigCypress.languageOptions },
    plugins: { ...EslintConfigCypress.plugins },
    rules: { ...EslintConfigCypress.rules },
    settings: { ...EslintConfigCypress.settings },
  },
  {
    name: 'CRM: Server; NodeJS Express + Testing (Node)',
    files: ['apps/crm/server/src/**/*.[jt]s'],
    languageOptions: {
      ...EslintConfigExpress.languageOptions,
      // parserOptions: { project: 'apps/crm/server/tsconfig.json' },
      parserOptions: { projectService: true },
    },
    plugins: { ...EslintConfigExpress.plugins },
    rules: { ...EslintConfigExpress.rules },
    settings: {
      ...EslintConfigExpress.settings,
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: ['apps/crm/server/tsconfig.json'],
        },
      },
    },
  },
  {
    name: 'CRM: Server; GraphQL',
    files: ['apps/crm/server/**/*.graphql'],
    languageOptions: {
      ...EslintConfigGraphQL.languageOptions,
      parserOptions: {
        graphqlConfig: {
          schema: 'apps/crm/server/src/graphql/schema.graphql',
        },
      },
    },
    plugins: { ...EslintConfigGraphQL.plugins },
    rules: { ...EslintConfigGraphQL.rules.server, 'prettier/prettier': 'error' },
  },
  ConfigPrettier,
  {
    name: 'ConfigPrettier Overrides',
    rules: {
      '@stylistic/lines-around-comment': ['error', { beforeBlockComment: true }],
    },
  },
];
