# vitest-environment-ui5

[![npm](https://img.shields.io/npm/v/vitest-environment-ui5)](https://www.npmjs.com/package/vitest-environment-ui5) [![test](https://github.com/mauriciolauffer/vitest-environment-ui5/actions/workflows/test.yml/badge.svg)](https://github.com/mauriciolauffer/vitest-environment-ui5/actions/workflows/test.yml)

A `Vitest Environment` for unit testing `UI5` code. Run your unit tests in a blazing fast way! Neither webserver nor browser are required. It runs in `Node.js` and uses `jsdom` to emulate browser environment.

See [Vitest Environment](https://vitest.dev/guide/environment.html) and [jsdom](https://github.com/jsdom/jsdom) for more details.

## Installation

Install `vitest-environment-ui5`, and `vitest`, as devDependencies:

```shell
$ npm i -D vitest  vitest-environment-ui5
```

## Setup

Vitest uses `node` as default test environment. In order to change it to a different environment, `vitest-environment-ui5`, we will either have to define it in `vitest.config.js` or add a `@vitest-environment` docblock at the top of the test file. See [Vitest Config](https://vitest.dev/config/#environment) for more details.

`vitest-environment-ui5` builds `jsdom` from a local HTML file, no webserver required. The HTML file should contain the `UI5` bootstrap, similar to this one: [ui5 bootstrap](test/fixtures/ui5-unit-test.html).

You can change the [UI5 bootstrap configuration](https://sapui5.hana.ondemand.com/sdk/#/topic/a04b0d10fb494d1cb722b9e341b584ba) as you wish, just like in your webapp. You can even open the file in a browser to see `UI5` being loaded. However, no tests will be executed.

### Vitest Configuration

```js
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "ui5",
    environmentOptions: {
      ui5: {
        path: "test/ui5-unit-test.html", // Path to the HTML file containing UI5 bootstrap
        timeout: 200, // UI5 load timeout in ms, default is 100ms
      },
    },
  },
});
```

### Vitest DocBlock

```js
/**
 * @vitest-environment ui5
 * @vitest-environment-options { "path": "test/ui5-unit-test.html" }
 */

import { expect, test } from "vitest";

test("UI5 is loaded", () => {
  expect(window.sap).toBeTruthy();
  expect(sap).toBeTruthy();
  expect(sap.ui.getCore()).toBeTruthy();
  expect(sap.ui.version).toBeTruthy();
});
```

## Run

Run the tests with `Vitest` [CLI](https://vitest.dev/guide/cli.html):

```shell
$ vitest
```

## Don't be afraid

`jsdom` is not a real browser, but gets the job done for unit testing. All major javascript frameworks use it today: `React`, `Vue`, `Svelte`, and even our old friend `jQuery`. It has over 20M weekly downloads in [NPM](https://www.npmjs.com/package/jsdom)!

This package simplifies what was introduced in the blog post[Modern JavaScript testing frameworks with Fiori/UI5 – Vitest](https://community.sap.com/t5/technology-blog-posts-by-members/modern-javascript-testing-frameworks-with-fiori-ui5-vitest/ba-p/13573097)

## Author

Mauricio Lauffer

- LinkedIn: [https://www.linkedin.com/in/mauriciolauffer](https://www.linkedin.com/in/mauriciolauffer)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
