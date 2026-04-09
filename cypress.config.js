const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://www.kasa.live/',
    setupNodeEvents(on, config) {
      // Implementar listeners de screenshots/logs aqui
    },
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});