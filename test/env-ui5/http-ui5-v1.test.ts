/**
 * @vitest-environment ui5
 * @vitest-environment-options { "path": "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html", "timeout": 200 }
 */

import { expect, describe, it } from "vitest";

describe("Load test from URL", () => {
  it("ui5 env is defined", () => {
    const environmentOptions =
      globalThis?.__vitest_worker__?.ctx?.environment?.options;
    const ui5Options = {
      ui5: {
        path: "https://ui5.sap.com/1.108/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html",
      },
    };
    expect(expect.getState().environment).toBe("ui5");
    expect(environmentOptions).toMatchObject(ui5Options);
  });

  it("jsdom is initiated", () => {
    expect(window).toBeTruthy();
    expect(document).toBeTruthy();
  });

  it("ui5 is loaded", () => {
    expect(window.sap).toBeTruthy();
    expect(sap).toBeTruthy();
    expect(sap.ui.getCore()).toBeTruthy();
    expect(sap.ui.getCore().ready).toBeFalsy();
    expect(sap.ui.getVersionInfo()).toBeTruthy();
  });
});
