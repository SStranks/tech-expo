import { ConfigPrettier, EslintConfigGlobal } from '@packages/eslint-config-global';
import EslintConfigHTML from '@packages/eslint-config-html';
import EslintConfigJavascript from '@packages/eslint-config-javascript';
import { EslintConfigJSON, EslintConfigJSON5, EslintConfigJSONC } from '@packages/eslint-config-json';
import EslintConfigTypescript from '@packages/eslint-config-typescript';
import EslintConfigYAML from '@packages/eslint-config-yaml';
import { defineConfig } from 'eslint/config';

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
    settings: { ...EslintConfigGlobal.settings },
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
    languageOptions: { ...EslintConfigYAML.languageOptions },
    plugins: { ...EslintConfigYAML.plugins },
    rules: { ...EslintConfigYAML.rules },
  },
  ConfigPrettier,
]);
