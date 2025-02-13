import config from "eslint-config-mlauffer-nodejs";
import tseslint from "typescript-eslint";
import vitest from "eslint-plugin-vitest";

config.splice(2, 1); // Remove SonarJS

export default tseslint.config(
  {
    ignores: ["dist/", "test/env-ui5/", "**/coverage/"],
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
    ...vitest.configs.recommended,
  },
);
