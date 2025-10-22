import { defineConfig } from 'cypress';

import path from 'node:path';
import url from 'node:url';

import WebpackCypressConfig from './cypress/webpack.cypress.js';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  component: {
    indexHtmlFile: path.resolve(__dirname, './cypress/support/componentIndex.html'),
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
