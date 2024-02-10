import { defineConfig } from 'cypress';
import WebpackConfig from './cypress/webpack.config';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      webpackConfig: WebpackConfig,
      framework: 'react',
      bundler: 'webpack',
    },
  },
});
