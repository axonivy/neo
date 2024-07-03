import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';

test.describe('home', () => {
  test('home', async ({ page }) => {
    await Neo.open(page);
    await expect(page.locator('text=Welcome to Axon Ivy NEO Designer')).toBeVisible();
  });
});
