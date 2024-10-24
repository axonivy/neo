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
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await neo.fileImport();
  await new ImportDialog(page).import(zipFile);
  await neo.navigation.open('Processes');
  await overview.hasGroup(`Project: ${wsName}`);
  await overview.openGroup('neo-test-project');
  await expect(overview.card('quickstart')).toBeVisible();
  await page.goto('');
  await overview.deleteCard(wsName, true);
});
