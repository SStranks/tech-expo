import PluginEslintYAML from 'eslint-plugin-yml';
import ParserEslintYAML from 'yaml-eslint-parser';

const EslintConfigYAML = {
  languageOptions: {
    parser: ParserEslintYAML,
  },
  plugins: {
    yml: PluginEslintYAML,
  },
  rules: {
    ...PluginEslintYAML.configs.standard.rules,
    ...PluginEslintYAML.configs.prettier.rules,
  },
};

export default EslintConfigYAML;
