import test, { expect } from '@playwright/test';
import { Neo } from '../../page-objects/neo';

test('logout User', async ({ page }) => {
  await Neo.openWorkspace(page);
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('menuitem', { name: 'Developer' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Developer' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect(page.getByRole('button', { name: 'Developer' })).toBeVisible();
  // Because of the auto login in the test setup, we are again logged in after logout.
});
