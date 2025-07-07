/**
 * @vitest-environment ui5
 * @vitest-environment-options { "path": "https://ui5.sap.com/1.38.65/test-resources/sap/m/demokit/helloworld/index.html", "timeout": 400 }
 */

import { expect, describe, it } from "vitest";

describe("Load test from URL with UI5 v1.38", () => {
  it("ui5 is loaded", () => {
    expect(window.sap).toBeTruthy();
    expect(sap).toBeTruthy();
    expect(sap.ui.getCore()).toBeTruthy();
    expect(sap.ui.version).toContain("1.38");
    expect(sap.ui.getCore().ready).toBeFalsy();
  });
});
