import test, { expect } from '@playwright/test';
import { ImportDialog } from '../page-objects/import-dialog';
import { Neo } from '../page-objects/neo';
import { rmWorkspaceExportDir, workspaceExportZip } from './constants';

test.afterAll(() => {
  rmWorkspaceExportDir();
});

test('file import', async ({ page, browserName }, testInfo) => {
  const zipFile = workspaceExportZip('importMe.zip');
  const { overview, neo } = await Neo.exportWorkspace(page, zipFile);
  const wsName = `${browserName}file-import-ws${testInfo.retry}`;
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your application: ${wsName}`)).toBeVisible();
  await neo.fileImport();
  const dialog = new ImportDialog(page);
  await dialog.import(zipFile);
  await expect(page.getByRole('status').getByText('Projects imported into workspace')).toBeVisible();
  await neo.processes();
  await expect(overview.card('quickstart')).toBeVisible();
  await page.goto('');
  await overview.deleteCard(wsName, true);
});
