import { expect, type Page, test } from '@playwright/test';
import { Neo } from '../../page-objects/neo';
import { RoleEditor } from '../../page-objects/roles-editor';
import { APP, TEST_PROJECT } from '../constants';

const openRoles = async (page: Page) => {
  const neo = await Neo.openWorkspace(page, `configurations/${APP}/${TEST_PROJECT}/config/roles.yaml`);
  const editor = new RoleEditor(neo, 'roles');
  await editor.expectOpen('Employee');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openRoles(page);
});

test.describe('inscription', () => {
  test('change value', async ({ page }) => {
    const { editor } = await openRoles(page);
    const role = editor.rowByName('Order');
    const inscription = await role.openInscription();
    const valueSelect = inscription.inscription.getByLabel('Parent');
    await valueSelect.click();
    await page.getByRole('option', { name: 'Employee', exact: true }).click();
    await expect(role.row).toContainText('Employee');
    await valueSelect.click();
    await page.getByRole('option').first().click();
    await expect(role.row).not.toContainText('Employee');
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openRoles(page);
    const inscription = await editor.rowByName('Employee').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/roles-users.html/);
  });
});
