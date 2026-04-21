const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // Base URL of the React dev server
    baseUrl: 'http://localhost:3000',

    // Where test specs live
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',

    // Where support files live
    supportFile: 'cypress/support/e2e.js',

    // Viewport size — desktop-like
    viewportWidth: 1440,
    viewportHeight: 900,

    // Increase timeout since the app makes real API calls
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,

    // Keep videos of every run (helpful for CI debugging)
    video: true,

    // Take a screenshot only on failure
    screenshotOnRunFailure: true,

    // Retry failed tests once before marking them red
    retries: {
      runMode: 1,   // cypress run (CI / headed)
      openMode: 0   // cypress open (interactive)
    },

    setupNodeEvents(on, config) {
      // Node-level event hooks can go here
      return config;
    }
  }
});
