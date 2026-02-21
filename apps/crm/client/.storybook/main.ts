/* eslint-disable perfectionist/sort-objects */
import type { StorybookConfig } from '@storybook/react-vite';

import { mergeConfig } from 'vite';

import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

const config: StorybookConfig = {
  framework: '@storybook/react-vite',
  stories: ['../src/stories/*.mdx', '../src/stories/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-vitest',
    '@storybook/addon-webpack5-compiler-babel',
  ],
  staticDirs: fs.existsSync(publicDir) ? ['../public'] : [],
  core: {
    disableTelemetry: true,
  },
  viteFinal: (config) => {
    return mergeConfig(config, {
      resolve: {
        // BUG: 'vite-tsconfig-paths' does not work here; upstream bug in Vite Sass preprocessor
        alias: {
          '@Components': path.resolve(__dirname, '../src/components'),
          '@Config': path.resolve(__dirname, '../src/config'),
          '@Context': path.resolve(__dirname, '../src/context'),
          '@Data': path.resolve(__dirname, '../src/data'),
          '@Features': path.resolve(__dirname, '../src/features'),
          '@Hooks': path.resolve(__dirname, '../src/hooks'),
          '@Img': path.resolve(__dirname, '../src/assets/img'),
          '@Layouts': path.resolve(__dirname, '../src/layouts'),
          '@Lib': path.resolve(__dirname, '../src/lib'),
          '@Modules': path.resolve(__dirname, '../src/modules'),
          '@Pages': path.resolve(__dirname, '../src/pages'),
          '@Redux': path.resolve(__dirname, '../src/redux'),
          '@Routes': path.resolve(__dirname, '../src/routes'),
          '@Sass': path.resolve(__dirname, '../src/assets/sass'),
          '@Services': path.resolve(__dirname, '../src/services'),
          '@Shared': path.resolve(__dirname, '../shared'),
          '@Stories': path.resolve(__dirname, '../src/stories'),
          '@Svg': path.resolve(__dirname, '../src/assets/svg'),
          '@Types': path.resolve(__dirname, '../src/types'),
          '@Utils': path.resolve(__dirname, '../src/utils'),
        },
      },
    });
  },
};

export default config;
