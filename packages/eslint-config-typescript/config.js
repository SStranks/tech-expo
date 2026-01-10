/* eslint-disable perfectionist/sort-objects */
import PluginStylistic from '@stylistic/eslint-plugin';
import PluginTypescriptEslint from '@typescript-eslint/eslint-plugin';
import ParserTypescriptEslint from '@typescript-eslint/parser';
import PluginImportX, { flatConfigs as PluginImportXConfigs } from 'eslint-plugin-import-x';
import globals from 'globals';

export { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';

const EslintConfigTypescript = {
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
    '@stylistic': PluginStylistic,
    '@typescript-eslint': PluginTypescriptEslint,
    'import-x': PluginImportX,
  },
  rules: {
    ...PluginImportXConfigs.recommended.rules,
    ...PluginStylistic.configs.recommended.rules,
    'import-x/no-unresolved': 'error',
    '@stylistic/jsx-curly-brace-presence': ['error', { propElementValues: 'always' }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-require-imports': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/no-restricted-imports': [
      'warn',
      {
        name: 'react-redux',
        importNames: ['useSelector', 'useDispatch'],
        message: 'Use typed hooks `useAppDispatch` and `useAppSelector` instead.',
      },
    ],
  },
  settings: {
    'import-x/ignore': ['node_modules'],
    'import-x/parsers': {
      '@typescript-eslint/parser': ['*.ts', '*.tsx', '*.html'],
    },
  },
};

export default EslintConfigTypescript;
