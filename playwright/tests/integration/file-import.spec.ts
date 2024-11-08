import test, { expect } from '@playwright/test';
import { ImportDialog } from '../page-objects/import-dialog';
import { Neo } from '../page-objects/neo';
import { rmWorkspaceExportDir, TEST_PROJECT, workspaceExportZip } from './constants';

test.afterAll(() => {
  rmWorkspaceExportDir();
});

test('file import', async ({ page, browserName }, testInfo) => {
  const zipFile = workspaceExportZip('importMe.zip');
  const { overview, neo } = await Neo.exportWorkspace(page, zipFile);
  const wsName = `${browserName}file-import-ws${testInfo.retry}`;
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await overview.clickFileImport();
  await new ImportDialog(page).import(zipFile);
  await page.keyboard.press('Escape');
  await neo.navigation.open('Processes');
  await overview.hasGroup(`Project: ${wsName}`);
  await overview.openGroup(TEST_PROJECT);
  await expect(overview.card('quickstart')).toBeVisible();
  await page.goto('');
  await overview.deleteCard(wsName, true);
});
