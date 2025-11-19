import test, { expect } from '@playwright/test';
import { Neo } from '../../page-objects/neo';
import { WORKSPACE } from '../constants';

test('logout User', async ({ page }) => {
  await Neo.openWorkspace(page);
  await page.getByRole('button', { name: 'Settings' }).click();
  await expect(page.getByRole('menuitem', { name: 'Developer' })).toBeVisible();
  await page.getByRole('menuitem', { name: 'Developer' }).click();
  await page.getByRole('menuitem', { name: 'Logout' }).click();
  await expect(page.getByRole('textbox').first()).toBeFocused();
  expect(await page.title()).toContain('Login');
  expect(page.url()).toContain(`?originalUrl=/neo/${WORKSPACE}`.replaceAll('/', '%2F'));
});
