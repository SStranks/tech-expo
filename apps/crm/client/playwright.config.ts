import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  forbidOnly: !!process.env.CI,
  fullyParallel: true,
  outputDir: './logs/playwright/test-results',
  retries: process.env.CI ? 2 : 0,
  testDir: './e2e',
  workers: process.env.CI ? 1 : undefined,
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure', outputFolder: './logs/playwright/report' }]],
  use: {
    baseURL: process.env.WEBPACK_CI_PUBLIC_URL || process.env.WEBPACK_DEV_PUBLIC_URL,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'off',
  },
  webServer: {
    command: 'webpack serve --disable-interpret --config ./webpack/webpack.dev.ts',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    url: process.env.WEBPACK_CI_PUBLIC_URL || process.env.WEBPACK_DEV_PUBLIC_URL,
  },
});
