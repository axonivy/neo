import { expect, type Page, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { ProcessEditor } from '../page-objects/process-editor';
import { APP, TEST_PROJECT } from './constants';

const startLogProcess = async (page: Page) => {
  const neo = await Neo.openEditor(page, `processes/${APP}/${TEST_PROJECT}/processes/runtimeLog`);
  await neo.navigation.resetAnimation();
  await neo.navigation.disableAnimation();
  const editor = new ProcessEditor(neo, 'runtimeLog');
  await editor.expectOpen('19619B9BB7B9F741-f0');
  const start = editor.elementByPid('19619B9BB7B9F741-f0');
  await start.triggerQuickAction(/Start Process/);
  const end = editor.elementByPid('19619B9BB7B9F741-f1');
  await end.expectExecuted();
  return { neo, editor };
};

test('should render table and rows correctly', async ({ page }) => {
  const { neo } = await startLogProcess(page);
  await neo.navigation.open('Log');
  const logView = page.locator('.runtime-log');
  await expect(logView).toBeVisible();
  const rows = logView.locator('table tbody tr');
  await expect(rows).toHaveCount(3);

  await logView.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('menu').getByRole('menuitem', { name: 'Delete All' }).click();
  await expect(rows).toHaveCount(0);
});
