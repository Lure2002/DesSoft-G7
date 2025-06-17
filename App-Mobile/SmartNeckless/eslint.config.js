// eslint.config.js
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  {
    ...expoConfig[0], // hereda la config base
    rules: {
      ...expoConfig[0].rules,
      "no-var": "off", // desactiva la regla que impide usar var
    },
  },
  {
    ignores: ["dist/*"],
  },
]);
