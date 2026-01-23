import { expect, test, type Page } from '@playwright/test';
import { DatabaseEditor } from '../../page-objects/database-editor';
import { Neo } from '../../page-objects/neo';
import { APP, TEST_PROJECT } from '../constants';

const openDatabases = async (page: Page) => {
  const neo = await Neo.openWorkspace(page, `configurations/${APP}/${TEST_PROJECT}/config/databases.yaml`);
  const editor = new DatabaseEditor(neo, 'databases');
  await editor.expectOpen('TestDatabaseConnection-001');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openDatabases(page);
});

test('change value', async ({ page }) => {
  const { editor } = await openDatabases(page);
  const connection = editor.rowByName('TestDatabaseConnection-001');
  const inscription = await connection.openInscription();
  await connection.expectSelected();
  const url = connection.row.locator('.ui-table-cell').nth(1);
  await expect(url).toHaveText('localhost:3306');
  const host = inscription.inscription.getByLabel('Host');
  await expect(host).toBeVisible();
  await host.fill('test-host');
  await expect(url).toHaveText('test-host:3306');
  await host.fill('localhost');
  await expect(url).toHaveText('localhost:3306');
});

test.describe('open help', () => {
  test('button', async ({ page, context }) => {
    const { editor } = await openDatabases(page);
    const connection = editor.rowByName('TestDatabaseConnection-001');
    const inscription = await connection.openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/databases.html/);
  });

  test('shortcut', async ({ page, context }) => {
    await openDatabases(page);
    const pagePromise = context.waitForEvent('page');
    await page.keyboard.press('F1');
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/databases.html/);
  });
});
