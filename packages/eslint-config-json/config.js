import PluginEslintJSONC from 'eslint-plugin-jsonc';
import ParserEslintJSONC from 'jsonc-eslint-parser';

export const EslintConfigJSON = {
  languageOptions: {
    parser: ParserEslintJSONC,
  },
  plugins: {
    jsonc: PluginEslintJSONC,
  },
  rules: {
    ...PluginEslintJSONC.configs['recommended-with-json'].rules,
    ...PluginEslintJSONC.configs['prettier'].rules,
  },
};

export const EslintConfigJSONC = {
  languageOptions: {
    parser: ParserEslintJSONC,
  },
  plugins: {
    jsonc: PluginEslintJSONC,
  },
  rules: {
    ...PluginEslintJSONC.configs['recommended-with-jsonc'].rules,
    ...PluginEslintJSONC.configs['prettier'].rules,
  },
};

export const EslintConfigJSON5 = {
  languageOptions: {
    parser: ParserEslintJSONC,
  },
  plugins: {
    jsonc: PluginEslintJSONC,
  },
  rules: {
    ...PluginEslintJSONC.configs['recommended-with-json5'].rules,
    ...PluginEslintJSONC.configs['prettier'].rules,
  },
};
