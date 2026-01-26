import { expect, type Page, test } from '@playwright/test';
import { Neo } from '../../page-objects/neo';
import { UserEditor } from '../../page-objects/user-editor';
import { APP, TEST_PROJECT } from '../constants';

const openUsers = async (page: Page) => {
  const neo = await Neo.openWorkspace(page, `configurations/${APP}/${TEST_PROJECT}/config/users.yaml`);
  const editor = new UserEditor(neo, 'users');
  await editor.expectOpen('wt');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openUsers(page);
});

test.describe('inscription', () => {
  test('change value', async ({ page }) => {
    const { editor } = await openUsers(page);
    const user = editor.rowByName('mc');
    const inscription = await user.openInscription();
    const fullName = inscription.inscription.getByLabel('Full Name', { exact: true });
    await fullName.fill('changed');
    await expect(user.row).toContainText('changed');
    await fullName.fill('Marie Curie');
    await expect(user.row).not.toContainText('changed');
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openUsers(page);
    const inscription = await editor.rowByName('Employee').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/roles-users.html/);
  });
});
