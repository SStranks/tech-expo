import PluginJestDom from 'eslint-plugin-jest-dom';
import PluginTestingLibrary from 'eslint-plugin-testing-library';
import PluginJest from 'eslint-plugin-jest';

export const EslintConfigReactTest = {
  plugins: {
    'jest-dom': PluginJestDom,
    'testing-library': PluginTestingLibrary,
    jest: PluginJest,
  },
  rules: {
    ...PluginJestDom.configs.recommended.rules,
    ...PluginTestingLibrary.configs['react'].rules,
    ...PluginJest.configs.recommended.rules,
  },
};

export default [EslintConfigReactTest];
