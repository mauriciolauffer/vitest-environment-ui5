/**
 * @vitest-environment ui5
 * @vitest-environment-options { "path": "https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html", "timeout": 200 }
 */

import {expect, describe, it} from 'vitest';

describe('Load test from URL', () => {
  it('ui5 env is defined', () => {
    expect(expect.getState().environment).toBe('ui5');
    expect(globalThis?.__vitest_worker__?.ctx?.environment?.options).toMatchObject({ui5: {path: 'https://ui5.sap.com/test-resources/sap/m/demokit/orderbrowser/webapp/test/mockServer.html'}});
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
