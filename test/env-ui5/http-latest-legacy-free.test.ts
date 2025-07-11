/**
 * @vitest-environment ui5
 * @vitest-environment-options { "path": "https://ui5.sap.com/1-legacy-free/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html", "timeout": 6000 }
 */

import { expect, describe, it } from "vitest";

describe("Load test from URL", () => {
  it("ui5 env is defined", () => {
    const environmentOptions =
      globalThis?.__vitest_worker__?.config?.environmentOptions;
    const environmentOptionsDocBlock =
      globalThis?.__vitest_worker__?.ctx?.environment?.options;
    const ui5Options = {
      ui5: {
        path: "https://ui5.sap.com/1-legacy-free/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html",
      },
    };
    expect(expect.getState().environment).toBe("ui5");
    expect(environmentOptions).not.toMatchObject(ui5Options);
    expect(environmentOptionsDocBlock).toMatchObject(ui5Options);
  });

  it("jsdom is initiated", () => {
    expect(window).toBeTruthy();
    expect(document).toBeTruthy();
  });

  it("ui5 is loaded", async () => {
    expect(window.sap).toBeTruthy();
    expect(sap).toBeTruthy();
    expect(sap.ui.getCore).toBeFalsy();
    const versionInfo = await new Promise((resolve) => {
      sap.ui.require(["sap/ui/VersionInfo"], async (VersionInfo) => {
        resolve(await VersionInfo.load());
      });
    });
    expect(sap.ui.version).toBeFalsy;
    expect(versionInfo.version).toContain("legacy-free");
  });
});
