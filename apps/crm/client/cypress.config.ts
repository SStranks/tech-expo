import { defineConfig } from 'cypress';
import { default as WebpackCypressConfig } from './cypress/webpack.cypress.js';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      webpackConfig: WebpackCypressConfig,
      framework: 'react',
      bundler: 'webpack',
    },
  },
});
