/* eslint-disable perfectionist/sort-objects */
import RecommendedEslint from '@eslint/js';
import PluginTypescriptEslint from '@typescript-eslint/eslint-plugin';
import ParserTypescriptEslint from '@typescript-eslint/parser';
import PluginImport from 'eslint-plugin-import';
import PluginPerfectionist from 'eslint-plugin-perfectionist';
import PluginPrettier from 'eslint-plugin-prettier';
import PluginRegexp from 'eslint-plugin-regexp';
import PluginUnicorn from 'eslint-plugin-unicorn';
import globals from 'globals';

export { default as ConfigPrettier } from 'eslint-config-prettier';

export const EslintConfig = {
  ...PluginTypescriptEslint.configs.recommended,
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    globals: {
      ...globals.es2021,
    },
    parser: ParserTypescriptEslint,
    parserOptions: {
      requireConfigFile: false,
      ecmaVersion: 2021,
    },
  },
  plugins: {
    '@typescript-eslint': PluginTypescriptEslint,
    unicorn: PluginUnicorn,
    prettier: PluginPrettier,
    regexp: PluginRegexp,
    import: PluginImport,
    perfectionist: PluginPerfectionist,
  },
  rules: {
    ...RecommendedEslint.configs.recommended.rules,
    ...PluginUnicorn.configs.recommended.rules,
    ...PluginRegexp.configs.recommended.rules,
    ...PluginImport.flatConfigs.recommended.rules,
    // ...PluginPerfectionist.configs['recommended-line-length'].rules,
    'arrow-body-style': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'import/no-unresolved': 'error',
    'prettier/prettier': ['error'],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '(_req|_res|_next)' }],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/no-restricted-imports': [
      'warn',
      {
        name: 'react-redux',
        importNames: ['useSelector', 'useDispatch'],
        message: 'Use typed hooks `useAppDispatch` and `useAppSelector` instead.',
      },
    ],
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
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['*.ts', '*.tsx', '*.html'],
    },
    // ...PluginImport.configs.typescript.settings,
    'import/resolver': {
      // ...PluginImport.configs.typescript.settings['import/resolver'],
      typescript: {
        alwaysTryTypes: true,
        project: [
          'apps/**/+(client|frontend)/tsconfig.json',
          'apps/**/+(server|backend)/tsconfig.json',
          'tsconfig.json',
        ],
      },
    },
  },
};
