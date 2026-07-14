/* eslint-disable storybook/story-exports */
import type { Preview } from '@storybook/react-vite';

import { withTanStackRouter } from 'storybook-addon-tanstack-router';

import ThemeToggleDecorator from './helpers/ThemeToggleDecorator';

import '@Sass/global-imports.scss';

import SCSS_Exports from '@Sass/_exports.module.scss';

const { storybook_background_dark, storybook_background_light } = SCSS_Exports;

const preview = {
  decorators: [ThemeToggleDecorator, withTanStackRouter],
  globalTypes: {
    theme: {
      defaultValue: 'light',
      description: 'Global theme for components',
      name: 'Theme',
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
      defaultValue: {
        dark: storybook_background_dark,
        light: storybook_background_light,
      },
      description: 'Global background color for ThemeToggle',
      items: [{ title: 'light' }, { title: 'dark' }],
      name: 'Theme Background',
    },
  },
  initialGlobals: { theme: 'light', themeBg: { dark: storybook_background_dark, light: storybook_background_light } },
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
