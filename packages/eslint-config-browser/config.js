// @ts-check
import PluginCompat from 'eslint-plugin-compat';
import globals from 'globals';

const EslintConfigBrowser = {
  languageOptions: {
    globals: {
      ...globals.browser,
    },
  },
  plugins: {
    compat: PluginCompat,
  },
  rules: {
    ...PluginCompat.configs['flat/recommended'].rules,
  },
};

export default EslintConfigBrowser;
