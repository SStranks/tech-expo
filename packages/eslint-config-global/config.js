// @ts-check
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
        customGroups: [
          {
            groupName: 'message',
            elementNamePattern: '^message$',
          },
          {
            groupName: 'status',
            elementNamePattern: '^status$',
          },
          {
            groupName: 'data',
            elementNamePattern: '^data$',
          },
        ],
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
          objectType: 'non-destructured',
        },
      },
      {
        // Default/Fallback Configuration
        groups: ['top', 'member', 'multiline-member', 'unknown', 'method', 'multiline-method', 'bottom'],
        customGroups: [
          {
            groupName: 'top',
            elementNamePattern: ['^id$', '^name$'],
          },
          {
            groupName: 'bottom',
            elementNamePattern: '.+_metadata$',
          },
        ],
        useConfigurationIf: {
          objectType: 'non-destructured',
        },
      },
    ],
    'perfectionist/sort-exports': [
      'error',
      {
        groups: ['type-export', 'value-export'],
      },
    ],
    'perfectionist/sort-named-exports': 'error',
    'perfectionist/sort-named-imports': 'error',
    'perfectionist/sort-imports': [
      'error',
      {
        type: 'alphabetical',
        order: 'asc',
        ignoreCase: true,
        internalPattern: [String.raw`^@[A-Z]\w*`, String.raw`^#[A-Z]\w*`],
        newlinesBetween: 1,
        environment: 'node',
        groups: [
          ['type-external', 'type-builtin'],
          'type-internal',
          ['type-parent', 'type-sibling', 'type-index'],
          'external',
          'internal',
          'builtin',
          ['parent', 'sibling', 'index'],
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
          kebabCase: true,
          pascalCase: true,
        },
        ignore: [
          'index.(js|jsx|ts|tsx)',
          'DTO.(js|ts)$',
          'webpack.*',
          '.d.ts',
          'types.ts',
          '.test.ts',
          String.raw`use\w*.tsx`,
        ],
      },
    ],
  },
  settings: {},
};
