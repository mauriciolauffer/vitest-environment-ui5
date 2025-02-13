import { expect, describe, it } from "vitest";

describe("Load test from file", () => {
  it("ui5 env is defined", () => {
    const environmentOptions =
      globalThis?.__vitest_worker__?.ctx?.config?.environmentOptions;
    const ui5Options = { ui5: { path: "../fixtures/ui5.html", timeout: 1000 } };
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
    expect(sap.ui.getVersionInfo()).toBeTruthy();
  });
});
