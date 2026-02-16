// @ts-check
import PluginStorybook from 'eslint-plugin-storybook';

const EslintConfigStorybook = {
  settings: {},
  plugins: {
    storybook: PluginStorybook,
  },
  rules: {
    ...PluginStorybook.configs['flat/recommended'][1].rules,
  },
};

export default EslintConfigStorybook;
