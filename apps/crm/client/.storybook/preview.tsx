import type { Preview } from '@storybook/react-webpack5';

import '@Sass/global-imports.scss';
import ThemeToggleDecorator from '../src/stories/helpers/ThemeToggleDecorator';

import SCSS_Exports from '@Sass/_exports.module.scss';

const { storybook_background_dark, storybook_background_light } = SCSS_Exports;

const preview = {
  decorators: [ThemeToggleDecorator],
  initialGlobals: { theme: 'light', themeBg: { dark: storybook_background_dark, light: storybook_background_light } },
  globalTypes: {
    theme: {
      name: 'Theme',
      defaultValue: 'light',
      description: 'Global theme for components',
      toolbar: {
        dynamicTitle: true,
        icon: 'circlehollow',
        items: [
          { icon: 'sun', title: 'Light', value: 'light' },
          { icon: 'moon', title: 'Dark', value: 'dark' },
        ],
      },
    },
    themeBg: {
      name: 'Theme Background',
      description: 'Global background color for ThemeToggle',
      items: [{ title: 'light' }, { title: 'dark' }],
      defaultValue: {
        dark: storybook_background_dark,
        light: storybook_background_light,
      },
    },
  },
  parameters: {
    ally: {
      config: {},
      context: 'body',
      options: {},
    },
    backgrounds: {
      options: {
        default: { name: 'Default', value: 'var(--thm-background-screen)' },
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
} satisfies Preview;

export type StorybookGlobals = typeof preview.initialGlobals;
export default preview;
