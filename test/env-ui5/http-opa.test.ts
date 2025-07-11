/**
 * @vitest-environment ui5
 * @vitest-environment-options { "path": "https://sap.github.io/openui5-sample-app/", "timeout": 200 }
 */

import { expect, describe, it } from "vitest";

describe("Load test from URL with UI5 v1.136", () => {
  it("ui5 is loaded", () => {
    expect(window.sap).toBeTruthy();
    expect(sap).toBeTruthy();
    expect(sap.ui.getCore()).toBeTruthy();
    expect(sap.ui.version).toContain("1.136");
    expect(sap.ui.getCore().ready).toBeTruthy();
  });
});
