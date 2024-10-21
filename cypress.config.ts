import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://127.0.0.1:4000'
  }
});
