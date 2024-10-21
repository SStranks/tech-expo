import PluginStorybook from 'eslint-plugin-storybook';

export const EslintConfigStorybook = {
  plugins: {
    storybook: PluginStorybook,
  },
  rules: {
    ...PluginStorybook.configs['flat/recommended'][1].rules,
  },
  settings: {},
};

export default [EslintConfigStorybook];
