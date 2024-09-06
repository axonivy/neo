import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  timeout: 1000 * (process.env.CI ? 60 : 30),
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['./custom-reporter.ts'], ['junit', { outputFile: 'report.xml' }], ['list']] : 'html',
  workers: process.env.CI ? 1 : undefined,
  use: {
    actionTimeout: 0,
    baseURL: 'http://localhost:5173/neo/',
    trace: 'retain-on-failure',
    headless: process.env.CI ? true : false
  },
  webServer: {
    command: 'npm run dev --include-workspace-root -w neo',
    url: 'http://localhost:5173/neo/',
    reuseExistingServer: !process.env.CI
  },
  globalTeardown: './global.teardown',
  projects: [
    { name: 'integration-chrome', use: { ...devices['Desktop Chrome'] }, testDir: './tests/integration' },
    { name: 'integration-firefox', use: { ...devices['Desktop Firefox'] }, testDir: './tests/integration' },
    { name: 'integration-webkit', use: { ...devices['Desktop Safari'] }, testDir: './tests/integration' },
    { name: 'screenshots', use: { ...devices['Desktop Chrome'] }, testDir: './tests/screenshots', retries: 0 }
  ]
});
