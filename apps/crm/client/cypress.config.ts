import { defineConfig } from "cypress";
import CypressGlobal from "@packages/cypress-config";

export default defineConfig({
  ...CypressGlobal,

  e2e: {
    // TODO:  Can we get .env variable in here to link dev server?
    baseUrl: "http://localhost:3000/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },

  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },
});
