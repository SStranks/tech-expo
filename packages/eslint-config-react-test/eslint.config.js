import PluginJestDom from 'eslint-plugin-jest-dom';
import PluginTestingLibrary from 'eslint-plugin-testing-library';

export const EslintConfigReactTest = {
  plugins: {
    'jest-dom': PluginJestDom,
    'testing-library': PluginTestingLibrary,
  },
  rules: {
    ...PluginJestDom.configs.recommended.rules,
    ...PluginTestingLibrary.configs['react'].rules,
  },
};

export default [EslintConfigReactTest];
