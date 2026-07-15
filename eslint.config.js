/* eslint-disable perfectionist/sort-objects */
import EslintConfigCypress from '@packages/eslint-config-cypress';
import EslintConfigExpress from '@packages/eslint-config-express';
import { ConfigPrettier, EslintConfigGlobal } from '@packages/eslint-config-global';
import EslintConfigGraphQL from '@packages/eslint-config-graphql';
import EslintConfigHTML from '@packages/eslint-config-html';
import EslintConfigJavascript from '@packages/eslint-config-javascript';
import { EslintConfigJSON, EslintConfigJSON5, EslintConfigJSONC } from '@packages/eslint-config-json';
import EslintConfigNode from '@packages/eslint-config-node';
import EslintConfigPlaywright from '@packages/eslint-config-playwright';
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
      '**/private.*',
      '**/private/*',
      '**/migrations/meta/',
      '**/routeTree.gen.ts',
      '!**/.storybook/',
      'pnpm-lock.yaml',
      'pnpm-lock.*.yaml',
      'pnpm-workspace.yaml',
      'package-lock.json',
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
            'tsconfig.json',
            'apps/crm/client/tsconfig.json',
            'apps/crm/server/tsconfig.json',
            'apps/crm/shared/tsconfig.json',
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
    name: 'React Configuration',
    files: ['**/*.[jt]sx'],
    languageOptions: { ...EslintConfigReact.languageOptions },
    plugins: { ...EslintConfigReact.plugins },
    rules: { ...EslintConfigReact.rules },
    settings: { ...EslintConfigReact.settings },
  },
  {
    name: 'Storybook Configuration',
    files: ['**/*.stories.*', '**/.storybook/**/*.{js,jsx,mjs,ts,tsx}'],
    plugins: { ...EslintConfigStorybook.plugins },
    rules: { ...EslintConfigStorybook.rules },
    settings: {
      ...EslintConfigStorybook.settings,
    },
  },
  {
    name: 'Cypress Configuration',
    files: ['**/cypress/**/*', '**/cypress/**/*'],
    plugins: { ...EslintConfigCypress.plugins },
    rules: { ...EslintConfigCypress.rules },
    settings: {
      ...EslintConfigCypress.settings,
    },
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
    extends: [...EslintConfigJSON.extends],
    languageOptions: { ...EslintConfigJSON.languageOptions },
    plugins: { ...EslintConfigJSON.plugins },
  },
  {
    name: 'JSONC Configuration',
    files: ['**/*.jsonc', '**/tsconfig.json'],
    extends: [...EslintConfigJSONC.extends],
    languageOptions: { ...EslintConfigJSONC.languageOptions },
    plugins: { ...EslintConfigJSONC.plugins },
  },
  {
    name: 'JSON5 Configuration',
    files: ['**/*.json5'],
    extends: [...EslintConfigJSON5.extends],
    languageOptions: { ...EslintConfigJSON5.languageOptions },
    plugins: { ...EslintConfigJSON5.plugins },
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
  // ====================================
  // ============= PACKAGES =============
  // ====================================
  {
    name: '@packages',
    files: ['./*.[jt]s', 'packages/**/*.[jt]s'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(import.meta.dirname, './'),
      },
    },
  },
  // ====================================
  // =============== APPS ===============
  // ====================================
  {
    name: '@apps/crm/client',
    files: [
      'apps/crm/client/src/**/*',
      'apps/crm/client/webpack/**/*',
      'apps/crm/client/.storybook/**/*',
      'apps/crm/client/cypress/**/*',
      'apps/crm/client/*',
    ],
    ignores: ['apps/crm/client/src/**/?(*.)+(spec|test).*'],
    // processor: EslintConfigGraphQL.processor,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(import.meta.dirname, 'apps/crm/client'),
      },
    },
  },
  {
    name: '@apps/crm/client: GraphQL',
    files: ['apps/crm/client/src/**/*.graphql'],
    languageOptions: {
      ...EslintConfigGraphQL.languageOptions,
    },
    plugins: { ...EslintConfigGraphQL.plugins },
    rules: { ...EslintConfigGraphQL.rules.client },
  },
  {
    name: '@apps/crm/client: Testing; Vitest + RTL',
    files: ['apps/crm/client/src/**/?(*.)+(spec|test).*'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(import.meta.dirname, 'apps/crm/client'),
      },
    },
    plugins: { ...EslintConfigReactVitest.plugins },
    rules: { ...EslintConfigReactVitest.rules },
  },
  {
    name: '@apps/crm/client: Testing; Playwright',
    files: ['apps/crm/client/e2e/**/?(*.)+(spec|test).*'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(import.meta.dirname, 'apps/crm/client'),
      },
    },
    plugins: { ...EslintConfigPlaywright.plugins },
    rules: { ...EslintConfigPlaywright.rules },
  },
  {
    name: '@apps/crm/server: NodeJS Express + Testing (Node)',
    files: ['apps/crm/server/src/**/*', 'apps/crm/server/*'],
    languageOptions: {
      ...EslintConfigNode.languageOptions,
      ...EslintConfigExpress.languageOptions,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(import.meta.dirname, 'apps/crm/server'),
      },
    },
    plugins: { ...EslintConfigNode.plugins, ...EslintConfigExpress.plugins },
    rules: { ...EslintConfigNode.rules, ...EslintConfigExpress.rules },
    settings: {
      ...EslintConfigExpress.settings,
    },
  },
  {
    name: '@apps/crm/server: GraphQL',
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
    name: '@apps/crm/shared: GraphQL',
    files: ['apps/crm/shared/**/*.graphql'],
    languageOptions: {
      ...EslintConfigGraphQL.languageOptions,
    },
    plugins: { ...EslintConfigGraphQL.plugins },
    rules: { ...EslintConfigGraphQL.rules.server, 'prettier/prettier': 'error' },
  },
  {
    name: '@apps/crm/shared: NodeJS',
    files: ['apps/crm/shared/src/**/*'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: path.join(import.meta.dirname, 'apps/crm/shared'),
      },
    },
  },
  ConfigPrettier,
]);
