import PluginStorybook from 'eslint-plugin-storybook';

export const EslintConfigStorybook = {
  plugins: {
    storybook: PluginStorybook,
  },
  rules: {
    ...PluginStorybook.configs.recommended.overrides[0].rules,
  },
  settings: {},
};

export default [EslintConfigStorybook];
