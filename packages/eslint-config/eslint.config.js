import ParserTypescriptEslint from '@typescript-eslint/parser';
import PluginTypescriptEslint from '@typescript-eslint/eslint-plugin';
import PluginUnicorn from 'eslint-plugin-unicorn';
import PluginPrettier from 'eslint-plugin-prettier';
import PluginImport from 'eslint-plugin-import';
import PluginRegexp from 'eslint-plugin-regexp';
import PluginPerfectionist from 'eslint-plugin-perfectionist';

import RecommendedEslint from '@eslint/js';
import globals from 'globals';

export { default as ConfigPrettier } from 'eslint-config-prettier';

export const EslintConfig = {
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
    import: PluginImport,
    prettier: PluginPrettier,
    regexp: PluginRegexp,
    perfectionist: PluginPerfectionist,
  },
  rules: {
    ...RecommendedEslint.configs.recommended.rules,
    ...PluginUnicorn.configs.recommended.rules,
    ...PluginTypescriptEslint.configs.recommended.rules,
    ...PluginRegexp.configs.recommended.rules,
    // ...PluginPerfectionist.configs['recommended-line-length'].rules,
    'arrow-body-style': 'off',
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    'import/no-unresolved': 'error',
    'prettier/prettier': ['error'],
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'error',
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
    ...PluginImport.configs.typescript.settings,
    'import/resolver': {
      ...PluginImport.configs.typescript.settings['import/resolver'],
      typescript: {
        alwaysTryTypes: true,
        project: ['**/+(client|frontend)/tsconfig.json', '**/+(server|backend)/tsconfig.json'],
      },
    },
  },
};
