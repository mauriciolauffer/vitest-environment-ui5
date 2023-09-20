import type {Environment} from 'vitest';
import {populateGlobal} from 'vitest/environments';
import type {JSDOM, DOMWindow, FileOptions} from 'jsdom';
import type Ui5Options from '../types/globals';

/**
 * Build JSDOM from HTML file containing UI5 bootstrap configuration
 */
async function buildFromFile(JSDOM: any, ui5: Ui5Options): Promise<JSDOM> {
  const options: FileOptions = {
    resources: 'usable',
    referrer: 'https://ui5.sap.com/',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse: (jsdomWindow) => {
      // Patch window.matchMedia because it doesn't exist in JSDOM
      Object.defineProperty(jsdomWindow, 'matchMedia', {
        writable: true,
        configurable: true,
        value: (query: any) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: () => { },
          removeEventListener: () => { },
          dispatchEvent: () => { }
        })
      });
      // Patch window.performance.timing because it doesn't exist in nodejs nor JSDOM
      Object.defineProperty(jsdomWindow.performance, 'timing', {
        writable: true,
        configurable: true,
        value: {
          fetchStart: Date.now(),
          navigationStart: Date.now()
        }
      });
    }
  };

  return JSDOM.fromFile(ui5.path, options);
}


/**
 * Add load and error events to UI5 bootstrap script tag to handle its status
 */
function addScriptEvents(window: DOMWindow): void {
  const ui5Script = window.document.getElementById('sap-ui-bootstrap');
  if (ui5Script) {
    ui5Script.addEventListener('load', function() {
      window.sap.ui.getCore().attachInit(() => {
        window.onUi5ModulesLoaded(true);
      });
    });
    ui5Script.addEventListener('error', function() {
      window.onUi5ModulesLoaded(false);
    });
  }
}

/**
 * Await UI5 to be loaded: onInit event
 */
async function ui5Loaded(window: DOMWindow): Promise<boolean> {
  return new Promise((resolve, reject) => {
    window.onUi5ModulesLoaded = (isLoaded: boolean) => {
      setTimeout(() => {
        isLoaded ? resolve(true) : reject(false);
      }, 0);
    };
  });
}

/**
 * Vitest environment for UI5
 */
export default <Environment>({
  name: 'ui5',
  transformMode: 'web',
  async setup(global, {ui5 = {}}) {
    const {JSDOM} = await import('jsdom');
    const dom = await buildFromFile(JSDOM, ui5);
    addScriptEvents(dom.window);
    await ui5Loaded(dom.window);
    const hrefFile = dom.window.location.href;
    dom.reconfigure({url: 'http://localhost/'}); // Workaround to avoid > SecurityError: localStorage is not available for opaque origins
    const {keys, originals} = populateGlobal(global, dom.window, {bindFunctions: true});
    dom.reconfigure({url: hrefFile}); // Comeback to original settings
    return {
      teardown(global) {
        dom.window.close();
        keys.forEach((key) => delete global[key]);
        originals.forEach((v, k) => global[k] = v);
      }
    };
  }
});
