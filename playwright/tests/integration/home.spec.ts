import { expect, test } from '@playwright/test';
import { AppInfo } from '../page-objects/app-info';
import { ImportDialog } from '../page-objects/import-dialog';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { rmWorkspaceExportDir, TEST_PROJECT, WORKSPACE, workspaceExportZip } from './constants';

test.afterAll(() => {
  rmWorkspaceExportDir();
});

test('navigate to home', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.home();
  await overview.expectCardsCountGreaterThan(0);
  const appInfo = new AppInfo(page);
  await expect(appInfo.title).toHaveText(`Welcome to your workspace: ${WORKSPACE}`);
  await expect(appInfo.infoCards).toHaveCount(4);
  await appInfo.clickInfoCard('Processes');
  await appInfo.clickInfoCard('Data Classes');
  await appInfo.clickInfoCard('Forms');
  await appInfo.clickInfoCard('Configurations');
});

test('search projects', async ({ page }) => {
  await Neo.openWorkspace(page);
  const overview = new Overview(page);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('test');
  await expect(overview.cards).toHaveCount(1);
});

test('import and delete project', async ({ page, browserName }, testInfo) => {
  const zipFile = workspaceExportZip('importMe.zip');
  const { overview, neo } = await Neo.exportWorkspace(page, zipFile);
  const wsName = `${browserName}import-and-delete-project${testInfo.retry}`;
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await overview.clickFileImport();
  await new ImportDialog(page).import(zipFile);
  await page.keyboard.press('Escape');
  await neo.navigation.open('Processes');
  await overview.hasGroup(`Project: ${wsName}`);
  await overview.openGroup(TEST_PROJECT);
  await expect(overview.card('quickstart')).toBeVisible();
  await neo.home();
  await overview.deleteCard(TEST_PROJECT);
  await neo.toast.expectSuccess('Project removed');
  await page.goto('');
  await overview.deleteCard(wsName, true);
});
