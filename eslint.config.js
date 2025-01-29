import globals from "globals";
import config from "eslint-config-mlauffer-nodejs";
import tseslint from "typescript-eslint";
import vitest from "eslint-plugin-vitest";

config.splice(2, 1); // Remove SonarJS

export default tseslint.config(
  {
    ignores: ["dist/", "examples/openui5-sample-app*", "**/coverage/"],
  },
  ...config,
  ...tseslint.configs.strict,
  {
    rules: {
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
    },
  },
  {
    files: ["test/**"],
    languageOptions: {
      globals: {
        ...globals.qunit,
        ...globals.browser,
        "sap": "readonly"
      },
    },
    ...vitest.configs.recommended,
  },
);
