import PluginVitest from '@vitest/eslint-plugin';
import PluginTestingLibrary from 'eslint-plugin-testing-library';

export const EslintConfigReactVitest = {
  plugins: {
    'testing-library': PluginTestingLibrary,
    vitest: PluginVitest,
  },
  rules: {
    ...PluginTestingLibrary.configs['react'].rules,
    ...PluginVitest.configs.recommended.rules,
  },
};

export default [EslintConfigReactVitest];
