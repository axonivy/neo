import { expect, type Page, test } from '@playwright/test';
import { Neo } from '../../page-objects/neo';
import { PersistenceEditor } from '../../page-objects/persistence-editor';
import { APP, TEST_PROJECT } from '../constants';

const openPersistence = async (page: Page) => {
  const neo = await Neo.openWorkspace(page, `configurations/${APP}/${TEST_PROJECT}/config/persistence.xml`);
  const editor = new PersistenceEditor(neo, 'persistence');
  await editor.expectOpen('TestPU');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openPersistence(page);
});

test.describe('inscription', () => {
  test('change value', async ({ page }) => {
    const { editor } = await openPersistence(page);
    const persistenceUnit = editor.rowByName('TestPU');
    const inscription = await persistenceUnit.openInscription();
    const name = inscription.inscription.getByLabel('Name', { exact: true });
    await name.fill('changed');
    const persistenceUnitChanged = editor.rowByName('changed');
    await expect(persistenceUnitChanged.row).toContainText('changed');
    await name.fill('TestPU');
    await expect(persistenceUnit.row).not.toContainText('changed');
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openPersistence(page);
    const inscription = await editor.rowByName('TestPU').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/persistence-configuration-editor.html/);
  });
});
