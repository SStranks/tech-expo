/* eslint-disable perfectionist/sort-objects */
import EslintConfigCypress from '@packages/eslint-config-cypress';
import EslintConfigExpress from '@packages/eslint-config-express';
import { ConfigPrettier, EslintConfigGlobal } from '@packages/eslint-config-global';
import EslintConfigGraphQL from '@packages/eslint-config-graphql';
import EslintConfigHTML from '@packages/eslint-config-html';
import EslintConfigJavascript from '@packages/eslint-config-javascript';
import { EslintConfigJSON, EslintConfigJSON5, EslintConfigJSONC } from '@packages/eslint-config-json';
import EslintConfigNode from '@packages/eslint-config-node';
import EslintConfigReact from '@packages/eslint-config-react';
import EslintConfigReactVitest from '@packages/eslint-config-react-vitest';
import EslintConfigStorybook from '@packages/eslint-config-storybook';
import EslintConfigTypescript, { createTypeScriptImportResolver, TSEslint } from '@packages/eslint-config-typescript';
import EslintConfigYAML, { PluginEslintYAML } from '@packages/eslint-config-yaml';
import { defineConfig } from 'eslint/config';

import path from 'node:path';

export default defineConfig([
  {
    name: 'Global Ignores',
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/build/',
      '**/logs/',
      '**/__snapshots__/',
      '**/mocks/',
      '**/coverage/',
      '**/.sassdoc/',
      '**/webpack/stats/',
      '**/*.gen.*',
      '**/graphql/generated/',
      '!**/.storybook/',
      '**/private.*',
      '**/private/*',
      '**/migrations/meta/',
      'pnpm-lock.yaml',
      'pnpm-workspace.yaml',
    ],
  },
  {
    name: 'Global Configuration',
    languageOptions: { ...EslintConfigGlobal.languageOptions },
    plugins: { ...EslintConfigGlobal.plugins },
    rules: { ...EslintConfigGlobal.rules },
    settings: {
      ...EslintConfigGlobal.settings,
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          alwaysTryTypes: true,
          project: [
            'apps/crm/client/tsconfig.json',
            'apps/crm/server/tsconfig.json',
            'apps/crm/shared/tsconfig.json',
            'apps/crm/client/cypress/tsconfig.json',
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        }),
      ],
    },
  },
  {
    name: 'Javascript Configuration',
    files: ['**/*.js?(x)'],
    languageOptions: { ...EslintConfigJavascript.languageOptions },
    plugins: { ...EslintConfigJavascript.plugins },
    rules: { ...EslintConfigJavascript.rules },
    settings: { ...EslintConfigJavascript.settings },
  },
  {
    name: 'Typescript Configuration',
    files: ['**/*.ts?(x)'],
    extends: [TSEslint.configs.recommendedTypeChecked],
    languageOptions: { ...EslintConfigTypescript.languageOptions },
    plugins: { ...EslintConfigTypescript.plugins },
    rules: { ...EslintConfigTypescript.rules },
    settings: { ...EslintConfigTypescript.settings },
  },
  {
    name: 'HTML Configuration',
    files: ['**/*.html'],
    ignores: ['**/*EmailTemplate.html'],
    languageOptions: { ...EslintConfigHTML.languageOptions },
    plugins: { ...EslintConfigHTML.plugins },
    rules: { ...EslintConfigHTML.rules },
  },
  {
    name: 'JSON Configuration',
    files: ['**/*.json'],
    ignores: ['**/tsconfig.json'],
    languageOptions: { ...EslintConfigJSON.languageOptions },
    plugins: { ...EslintConfigJSON.plugins },
    rules: { ...EslintConfigJSON.rules },
  },
  {
    name: 'JSONC Configuration',
    files: ['**/*.jsonc', '**/tsconfig.json'],
    languageOptions: { ...EslintConfigJSONC.languageOptions },
    plugins: { ...EslintConfigJSONC.plugins },
    rules: { ...EslintConfigJSONC.rules },
  },
  {
    name: 'JSON5 Configuration',
    files: ['**/*.json5'],
    languageOptions: { ...EslintConfigJSON5.languageOptions },
    plugins: { ...EslintConfigJSON5.plugins },
    rules: { ...EslintConfigJSON5.rules },
  },
  {
    name: 'YAML Configuration',
    files: ['**/*.yaml', '**/*.yml'],
    extends: [PluginEslintYAML.configs.standard, PluginEslintYAML.configs.prettier],
    languageOptions: { ...EslintConfigYAML.languageOptions },
    plugins: { ...EslintConfigYAML.plugins },
    rules: { ...EslintConfigYAML.rules },
  },
  {
    name: 'Node Configuration',
    files: ['**/webpack*.[jt]s'],
    languageOptions: { ...EslintConfigNode.languageOptions },
    plugins: { ...EslintConfigNode.plugins },
    rules: { ...EslintConfigNode.rules },
  },
  // === INDIVIDUAL PROJECTS ===
  {
    name: 'CRM: Client; React + TypeScript',
    files: [
      'apps/crm/client/src/**/*.[jt]s?(x)',
      'apps/crm/client/.storybook/**/*.[jt]s?(x)',
      'apps/crm/client/webpack/**/*.[jt]s?(x)',
      'apps/crm/client/*.ts',
      'apps/pnpm-outdated/client/src/*.ts',
    ],
    ignores: ['apps/crm/client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
    processor: EslintConfigGraphQL.processor,
    languageOptions: {
      parserOptions: { projectService: true },
      ...EslintConfigReact.languageOptions,
    },
    plugins: { ...EslintConfigReact.plugins },
    rules: { ...EslintConfigReact.rules },
    settings: {
      ...EslintConfigReact.settings,
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
    },
  },
  {
    name: 'CRM: Client; Testing (Vitest + RTL)',
    files: ['apps/crm/client/src/**/?(*.)+(spec|test).[jt]s?(x)'],
    languageOptions: { ...EslintConfigReact.languageOptions },
    plugins: { ...EslintConfigReact.plugins, ...EslintConfigReactVitest.plugins },
    rules: { ...EslintConfigReact.rules, ...EslintConfigReactVitest.rules },
    settings: {
      ...EslintConfigReact.settings,
    },
  },
  {
    name: 'CRM: Client; Testing (Cypress)',
    files: ['apps/crm/client/cypress/**/*.[jt]s?(x)'],
    languageOptions: { ...EslintConfigCypress.languageOptions },
    plugins: { ...EslintConfigCypress.plugins },
    rules: { ...EslintConfigCypress.rules },
    settings: {
      ...EslintConfigCypress.settings,
    },
  },
  {
    name: 'CRM: Server; NodeJS Express + Testing (Node)',
    files: ['apps/crm/server/src/**/*.[jt]s', 'apps/crm/server/*.[jt]s'],
    languageOptions: {
      ...EslintConfigNode.languageOptions,
      ...EslintConfigExpress.languageOptions,
      parserOptions: { projectService: true },
    },
    plugins: { ...EslintConfigNode.plugins, ...EslintConfigExpress.plugins },
    rules: { ...EslintConfigNode.rules, ...EslintConfigExpress.rules },
    settings: {
      ...EslintConfigExpress.settings,
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
  {
    name: 'CRM: Shared; GraphQL',
    files: ['apps/crm/shared/**/*.graphql'],
    languageOptions: {
      ...EslintConfigGraphQL.languageOptions,
    },
    plugins: { ...EslintConfigGraphQL.plugins },
    rules: { ...EslintConfigGraphQL.rules.server, 'prettier/prettier': 'error' },
  },
  {
    name: 'CRM: Shared; NodeJS',
    files: ['apps/crm/shared/src/**/*.[jt]s'],
    languageOptions: {
      parserOptions: {
        // project: ['tsconfig.json', 'tsconfig.types.json'],
        tsconfigRootDir: path.join(import.meta.dirname, 'apps/crm/shared'),
      },
    },
    settings: {},
  },
  ConfigPrettier,
]);
