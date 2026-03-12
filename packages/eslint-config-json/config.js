// @ts-check
import PluginEslintJSONC from 'eslint-plugin-jsonc';
import * as ParserEslintJSONC from 'jsonc-eslint-parser';

export const EslintConfigJSON = {
  extends: [PluginEslintJSONC.configs['recommended-with-json'], PluginEslintJSONC.configs['prettier']],
  languageOptions: {
    parser: ParserEslintJSONC,
  },
  plugins: {
    jsonc: PluginEslintJSONC,
  },
};

export const EslintConfigJSONC = {
  extends: [PluginEslintJSONC.configs['recommended-with-jsonc'], PluginEslintJSONC.configs['prettier']],
  languageOptions: {
    parser: ParserEslintJSONC,
  },
  plugins: {
    jsonc: PluginEslintJSONC,
  },
};

export const EslintConfigJSON5 = {
  extends: [PluginEslintJSONC.configs['recommended-with-json5'], PluginEslintJSONC.configs['prettier']],
  languageOptions: {
    parser: ParserEslintJSONC,
  },
  plugins: {
    jsonc: PluginEslintJSONC,
  },
};
