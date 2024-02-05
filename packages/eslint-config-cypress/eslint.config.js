import PluginCypress from 'eslint-plugin-cypress';

export const EslintConfigCypress = {
  languageOptions: {},
  plugins: { cypress: PluginCypress },
  rules: { ...PluginCypress.configs.recommended.rules },
  settings: {},
};

export default [EslintConfigCypress];
