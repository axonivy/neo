import { type Locator, type Page, expect } from '@playwright/test';

const dir = process.env.SCREENSHOT_DIR ?? './target';

export const screenshot = async (page: Page, name: string, size?: { width?: number; height?: number }) => {
  await page.setViewportSize({ width: size?.width ?? 900, height: size?.height ?? 550 });
  const buffer = await page.screenshot({ path: `${dir}/screenshots/${name}.png`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(3000);
};

export const screenshotElement = async (locator: Locator, name: string) => {
  const buffer = await locator.screenshot({ path: `${dir}/screenshots/${name}.png`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(3000);
};
