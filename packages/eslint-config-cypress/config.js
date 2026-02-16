// @ts-check
import PluginCypress from 'eslint-plugin-cypress';

const EslintConfigCypress = {
  languageOptions: {},
  plugins: { cypress: PluginCypress },
  rules: { ...PluginCypress.configs.recommended.rules },
  settings: {},
};

export default EslintConfigCypress;
