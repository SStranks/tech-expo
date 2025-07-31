import { defineConfig } from 'cypress';

import WebpackCypressConfig from './cypress/webpack.cypress.js';

export default defineConfig({
  component: {
    devServer: {
      bundler: 'webpack',
      framework: 'react',
      webpackConfig: WebpackCypressConfig,
    },
  },

  e2e: {
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
});
