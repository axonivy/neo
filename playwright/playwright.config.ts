import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 1000 * (process.env.CI ? 60 : 30),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['./tests/custom-reporter.ts'], ['junit', { outputFile: 'report.xml' }], ['list']] : 'html',
  workers: process.env.CI ? 1 : undefined,
  use: {
    actionTimeout: 0,
    baseURL: process.env.CI ? 'http://localhost:4173/neo/' : 'http://localhost:5173/neo/',
    trace: 'retain-on-failure',
    headless: process.env.CI ? true : false
  },
  webServer: {
    command: process.env.CI ? 'npm run serve --include-workspace-root -w neo' : 'npm run dev --include-workspace-root',
    url: process.env.CI ? 'http://localhost:4173/neo/' : 'http://localhost:5173/neo/',
    reuseExistingServer: !process.env.CI
  },
  globalTeardown: './tests/global.teardown',
  projects: [
    { name: 'integration-chrome', use: { ...devices['Desktop Chrome'] }, testDir: './tests/integration' },
    { name: 'integration-firefox', use: { ...devices['Desktop Firefox'] }, testDir: './tests/integration' },
    { name: 'integration-webkit', use: { ...devices['Desktop Safari'] }, testDir: './tests/integration' },
    {
      name: 'screenshots',
      use: { ...devices['Desktop Chrome'], viewport: { width: 900, height: 550 }, colorScheme: 'light' },
      testDir: './tests/screenshots',
      retries: 0
    }
  ]
});
