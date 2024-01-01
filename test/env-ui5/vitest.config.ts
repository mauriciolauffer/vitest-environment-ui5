import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'ui5',
    environmentOptions: {
      ui5: {
        path: '../fixtures/ui5.html',
        timeout: 1000
      }
    }
  }
});
