/* eslint-disable perfectionist/sort-objects */
import type { StorybookConfig } from '@storybook/react-webpack5';

import CommonConfig from '../webpack/webpack.common.js';

const config: StorybookConfig = {
  framework: '@storybook/react-webpack5',
  stories: ['../src/stories/*.mdx', '../src/stories/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-onboarding',
    '@storybook/addon-webpack5-compiler-babel',
    '@storybook/addon-docs',
  ],

  staticDirs: ['../public'],

  core: {
    disableTelemetry: true,
  },

  babel: (config) => {
    return { ...config, rootMode: 'upward' };
  },

  webpackFinal: async (config) => {
    if (config.resolve) {
      config.resolve.alias = {
        ...config.resolve.alias,
        ...CommonConfig.resolve?.alias,
      };
    }

    /*
     * NOTE: Storybook contains CSS rule already; can't merge its rule object and my webpack one,
     * leads to duplicate rules and breaks storybook.
     */
    config.module?.rules?.push(
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'asIs',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      }
    );

    return config;
  },
};

export default config;
