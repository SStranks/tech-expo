/* eslint-disable perfectionist/sort-objects */
import PluginPerfectionist from 'eslint-plugin-perfectionist';
import PluginPrettier from 'eslint-plugin-prettier';
import PluginRegexp from 'eslint-plugin-regexp';
import PluginUnicorn from 'eslint-plugin-unicorn';

export { default as ConfigPrettier } from 'eslint-config-prettier';

export const EslintConfigGlobal = {
  plugins: {
    perfectionist: PluginPerfectionist,
    prettier: PluginPrettier,
    regexp: PluginRegexp,
    unicorn: PluginUnicorn,
  },
  rules: {
    ...PluginUnicorn.configs.recommended.rules,
    ...PluginRegexp.configs.recommended.rules,
    'arrow-body-style': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'prettier/prettier': ['error'],
    'perfectionist/sort-objects': [
      'error',
      {
        groups: ['status', 'message', 'data'],
        customGroups: {
          message: '^message$',
          status: '^status$',
          data: '^data$',
        },
        useConfigurationIf: {
          // Utilized in http response objects
          allNamesMatchPattern: '^(message|status|data)$',
        },
      },
      {
        // Ignore objects passed to fn calls; regexp name
        type: 'unsorted',
        useConfigurationIf: {
          callingFunctionNamePattern: '^(createSlice|pgTable|findFirst|postgresDB|relations)$',
        },
        destructuredObjects: false,
      },
      {
        // Default/Fallback Configuration
        destructuredObjects: { groups: false },
        groups: ['top', 'unknown', ['multiline', 'method'], 'bottom'],
        customGroups: {
          top: ['^id$', '^name$'],
          bottom: '.+_metadata$',
        },
      },
    ],
    'perfectionist/sort-exports': [
      'error',
      {
        groupKind: 'types-first',
      },
    ],
    'perfectionist/sort-named-imports': 'error',
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: true,
        internalPattern: [`^@[A-Z]\\w*`, `^#[A-Z]\\w*`],
        newlinesBetween: 'always',
        environment: 'node',
        groups: [
          ['external-type', 'builtin-type'],
          'internal-type',
          ['parent-type', 'sibling-type', 'index-type'],
          'external',
          'internal',
          'builtin',
          ['parent', 'sibling', 'index'],
          'object',
          'unknown',
          'style',
        ],
      },
    ],
    'unicorn/prefer-module': 'off',
    'unicorn/expiring-todo-comments': 'off',
    'unicorn/prevent-abbreviations': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/no-null': 'off',
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
        ignore: ['index.(js|jsx|ts|tsx)', 'webpack.*', '.d.ts', 'types.ts', '.test.ts', String.raw`use\w*.tsx`],
      },
    ],
  },
  settings: {},
};
