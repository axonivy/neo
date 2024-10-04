import test, { expect } from '@playwright/test';
import { ImportDialog } from '../page-objects/import-dialog';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { rmWorkspaceExportDir, workspaceExportZip } from './constants';

test('market import', async ({ page, browserName }, testInfo) => {
  const wsName = `${browserName}market-ws${testInfo.retry}`;
  const neo = await Neo.open(page);
  const overview = new Overview(page);
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your application: ${wsName}`)).toBeVisible();
  await neo.market();
  await overview.card('Microsoft Excel').click();
  await page.getByRole('dialog').getByRole('button').getByText('Install').click();
  await expect(page.getByRole('status').getByText('Product installed')).toBeVisible();
  await expect((await neo.processes()).card('WriteExcel')).toBeVisible();
  await page.goto('');
  await overview.deleteCard(wsName, true);
});

test.describe('file import', () => {
  test.afterAll(() => {
    rmWorkspaceExportDir();
  });

  test('import', async ({ page, browserName }, testInfo) => {
    const zipFile = workspaceExportZip('importMe.zip');
    const { overview, neo } = await Neo.exportWorkspace(page, zipFile);
    const wsName = `${browserName}file-import-ws${testInfo.retry}`;
    await overview.create(wsName);
    await expect(page.locator(`text=Welcome to your application: ${wsName}`)).toBeVisible();
    await neo.fileImport();
    const dialog = new ImportDialog(page);
    await dialog.import(zipFile);
    await expect(page.getByRole('status').getByText('Workspace imported')).toBeVisible();
    await neo.processes();
    await expect(overview.card('quickstart')).toBeVisible();
    await page.goto('');
    await overview.deleteCard(wsName, true);
  });
});
