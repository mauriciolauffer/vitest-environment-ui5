declare global {
  interface Window {
    sap: any;
    onUi5ModulesLoaded: any;
  }
}

interface Ui5Options {
  /**
   * The path to the HTML file containing the UI5 bootstrap setup
   */
  path: string;
}

export default Ui5Options;
