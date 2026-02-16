// @ts-check
import PluginJest from 'eslint-plugin-jest';
import PluginJestDom from 'eslint-plugin-jest-dom';
import PluginTestingLibrary from 'eslint-plugin-testing-library';

const EslintConfigReactJest = {
  plugins: {
    jest: PluginJest,
    'jest-dom': PluginJestDom,
    'testing-library': PluginTestingLibrary,
  },
  rules: {
    ...PluginJestDom.configs['flat/recommended'].rules,
    ...PluginTestingLibrary.configs['react'].rules,
    ...PluginJest.configs['flat/recommended'].rules,
  },
};

export default EslintConfigReactJest;
