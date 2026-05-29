// @ts-check
import PluginPlaywright from 'eslint-plugin-playwright';

const EslintConfigPlaywright = {
  plugins: {
    playwright: PluginPlaywright,
  },
  rules: {
    ...PluginPlaywright.configs['flat/recommended'].rules,
  },
};

export default EslintConfigPlaywright;
