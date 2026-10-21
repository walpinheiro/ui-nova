import { defineConfig } from '@playwright/test'
// Skill vue-component-development mandates `data-test-id` (not Playwright's
// default `data-testid`), so the testIdAttribute is aligned here. Without
// this, getByTestId() never matches any component.
export default defineConfig({
  testDir: './src',
  testMatch: ['**/_tests/*.e2e.spec.ts'],
  use: {
    testIdAttribute: 'data-test-id',
  },
  globalSetup: './scripts/playwright-global-setup.cjs',
})
