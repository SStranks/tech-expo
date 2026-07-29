// @ts-check
import PluginHTML from '@html-eslint/eslint-plugin';
import ParserHTML from '@html-eslint/parser';

const EslintConfigHTML = {
  languageOptions: {
    parser: ParserHTML,
  },
  plugins: {
    '@html-eslint': PluginHTML,
  },
  rules: {
    ...PluginHTML.configs['flat/recommended'].rules,
    '@html-eslint/attrs-newline': 'off',
    '@html-eslint/indent': ['error', 2],
    '@html-eslint/no-extra-spacing-tags': ['error', { enforceBeforeSelfClose: true }],
    '@html-eslint/require-closing-tags': ['error', { selfClosing: 'always' }],
  },
};

export default EslintConfigHTML;
