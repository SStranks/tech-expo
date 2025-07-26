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
  },
};

export default EslintConfigHTML;
