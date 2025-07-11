/**
 * @vitest-environment ui5
 * @vitest-environment-options { "path": "https://ui5.sap.com/1.136-legacy-free/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html", "timeout": 600 }
 */

import { expect, describe, it } from "vitest";

describe("Load test from URL with UI5 v1.136", () => {
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
