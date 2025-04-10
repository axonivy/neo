import { expect, type Page, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { ProcessEditor } from '../page-objects/process-editor';
import { APP, TEST_PROJECT } from './constants';

const startLogProcess = async (page: Page) => {
  const neo = await Neo.openEditor(page, `processes/${APP}/${TEST_PROJECT}/processes/runtimeLog`);
  const editor = new ProcessEditor(neo, 'runtimeLog');
  await editor.expectOpen('19619B9BB7B9F741-f0');
  const element = editor.elementByPid('19619B9BB7B9F741-f0');
  await element.triggerQuickAction(/Start Process/);
  await element.expectExecuted();
  const browser = await neo.browser();
  await browser.expectOpen();
  return { neo, editor };
};

test('should render table and rows correctly', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'webkit shows a ViewExpiredException instead of the form dialog');
  await startLogProcess(page);

  await Neo.openEditor(page, `log`);
  const table = page.locator('table');
  await expect(table).toBeVisible();
  const header = page.locator('table thead');
  await expect(header).toBeVisible();
  page.reload();
  const rows = page.locator('table tbody tr');
  await expect(rows).toHaveCount(3);

  await page.getByRole('button', { name: 'Menu' }).click();
  await page.getByRole('menuitem', { name: 'Delete All' }).click();
});
