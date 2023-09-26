import {expect, describe, it} from 'vitest';

describe('Load test from file', () => {
  it('ui5 env is defined', () => {
    expect(expect.getState().environment).toBe('ui5');
    expect(globalThis.__vitest_worker__.ctx.config.environmentOptions).toMatchObject({ui5: {path: '../fixtures/ui5.html'}});
  });

  it('jsdom is initiated', () => {
    expect(window).toBeTruthy();
    expect(document).toBeTruthy();
  });

  it('ui5 is loaded', () => {
    expect(window.sap).toBeTruthy();
    expect(sap).toBeTruthy();
    expect(sap.ui.getCore()).toBeTruthy();
    expect(sap.ui.version).toBeTruthy();
  });
});
