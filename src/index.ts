import type { Environment } from "vitest/environments";
import type { DOMWindow, FileOptions } from "jsdom";
import type { Ui5Options } from "../types/globals.js";
import { URL } from "node:url";
import { performance } from "node:perf_hooks";
import process from "node:process";
import { JSDOM } from "jsdom";
import { populateGlobal } from "vitest/environments";
import { getSafeTimers } from "vitest/utils";

const UI5_BOOTSTRAP_ID = "sap-ui-bootstrap"; // UI5 script tag ID
let UI5_TIMEOUT = 100; // UI5 load timeout in ms

/**
 * Await for next tick
 */
function waitNextTick(): Promise<void> {
  return new Promise((resolve) => {
    getSafeTimers().setTimeout(resolve, 25);
  });
}

/**
 * Catch jsdom window errors
 */
function catchWindowErrors(window: DOMWindow): () => void {
  let userErrorListenerCount = 0;
  /**
   * Throw UnhandlerError for window error events
   */
  function throwUnhandlerError(e: ErrorEvent) {
    if (userErrorListenerCount === 0 && e.error != null) {
      process.emit("uncaughtException", e.error);
    }
  }
  const addEventListener = window.addEventListener.bind(window);
  const removeEventListener = window.removeEventListener.bind(window);
  window.addEventListener("error", throwUnhandlerError);
  window.addEventListener = function (
    ...args: Parameters<typeof addEventListener>
  ) {
    if (args[0] === "error") {
      userErrorListenerCount++;
    }
    return addEventListener.apply(this, args);
  };
  window.removeEventListener = function (
    ...args: Parameters<typeof removeEventListener>
  ) {
    if (args[0] === "error" && userErrorListenerCount) {
      userErrorListenerCount--;
    }
    return removeEventListener.apply(this, args);
  };
  return function clearErrorHandlers() {
    window.removeEventListener("error", throwUnhandlerError);
  };
}

/**
 * Get jsdom configuration to build JSDOM from HTML file containing UI5 bootstrap configuration
 */
function getConfiguration(): FileOptions {
  return {
    resources: "usable",
    runScripts: "dangerously",
    pretendToBeVisual: true,
    beforeParse: (jsdomWindow) => {
      // Patch window.matchMedia because it doesn't exist in JSDOM
      Object.defineProperty(jsdomWindow, "matchMedia", {
        writable: true,
        configurable: true,
        value: (query: string) => ({
          matches: false,
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          dispatchEvent: () => {},
        }),
      });
    },
  };
}

/**
 * Build JSDOM from a local HTML file
 */
function buildFromFile(ui5: Ui5Options): Promise<JSDOM> {
  const options: FileOptions = {
    ...getConfiguration(),
    referrer: "https://ui5.sap.com/",
  };
  return JSDOM.fromFile(ui5.path, options);
}

/**
 * Build JSDOM from an URL
 */
function buildFromUrl(ui5: Ui5Options): Promise<JSDOM> {
  return JSDOM.fromURL(ui5.path, getConfiguration());
}

/**
 * Add load and error events to UI5 bootstrap script tag to handle its status
 */
function ui5BootstrapListener(window: DOMWindow): Promise<void> {
  return new Promise((resolve, reject) => {
    const ui5Script = window.document.getElementById(UI5_BOOTSTRAP_ID);
    if (ui5Script) {
      ui5Script.addEventListener("load", () => {
        resolve();
      });
      ui5Script.addEventListener("error", () => {
        reject(new Error(`Error loading ${UI5_BOOTSTRAP_ID}!`));
      });
    } else {
      reject(new Error(`Script tag ${UI5_BOOTSTRAP_ID} not found!`));
    }
  });
}

/**
 * Add load and error events to UI5 bootstrap script tag to handle its status
 */
async function ui5CoreLibraryListener(
  window: DOMWindow,
  startTime: number,
): Promise<void> {
  await waitNextTick();
  return new Promise((resolve, reject) => {
    const elapsedTime = performance.now() - startTime;
    if (elapsedTime > UI5_TIMEOUT) {
      reject(new Error(`UI5 load timeout: ${UI5_TIMEOUT}ms!`));
    } else if (window.sap?.ui?.getCore()) {
      resolve();
    } else {
      ui5CoreLibraryListener(window, startTime).then(resolve).catch(reject);
    }
  });
}

/**
 * Await UI5 to be loaded: onInit event
 */
function ui5Ready(window: DOMWindow): Promise<void> {
  return new Promise((resolve, reject) => {
    const core = window?.sap?.ui?.getCore();
    if (core) {
      core.ready ? core.ready(resolve) : core.attachInit(resolve); // eslint-disable-line @typescript-eslint/no-unused-expressions
    } else {
      reject(new Error("UI5 core not loaded!"));
    }
  });
}

/**
 * Returns whether the path is a valid URL or not
 */
function isValidUrl(path: string): boolean {
  try {
    return !!new URL(path);
  } catch (err: unknown | Error) {
    // eslint-disable-next-line no-console
    console.error("Invalid URL:", path, ". Error:", (err as Error)?.message);
    return false;
  }
}

/**
 * Vitest environment for UI5
 */
export default <Environment>{
  name: "ui5",
  transformMode: "web",
  async setup(global, { ui5 = {} }) {
    UI5_TIMEOUT = ui5.timeout ?? UI5_TIMEOUT;
    const isUrl = isValidUrl(ui5.path);
    let dom: JSDOM;
    let clearWindowErrors: () => void;
    try {
      dom = isUrl ? await buildFromUrl(ui5) : await buildFromFile(ui5);
      clearWindowErrors = catchWindowErrors(dom.window);
      await ui5BootstrapListener(dom.window);
      await ui5CoreLibraryListener(dom.window, performance.now());
      await ui5Ready(dom.window);
    } catch (err) {
      console.error(err); // eslint-disable-line no-console
      return Promise.reject(err);
    }
    const hrefFile = dom.window.location.href;
    if (!isUrl) {
      // Workaround to avoid > SecurityError: localStorage is not available for opaque origins
      dom.reconfigure({ url: "http://localhost/" });
    }
    const { keys, originals } = populateGlobal(global, dom.window, {
      bindFunctions: true,
    });
    if (!isUrl) {
      // Comeback to original settings
      dom.reconfigure({ url: hrefFile });
    }
    return {
      teardown(global) {
        clearWindowErrors();
        dom.window.close();
        keys.forEach((key) => delete global[key]); // eslint-disable-line @typescript-eslint/no-dynamic-delete
        originals.forEach((v, k) => (global[k] = v));
      },
    };
  },
};
