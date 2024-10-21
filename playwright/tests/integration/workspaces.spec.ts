import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { rmWorkspaceExportDir, workspace, workspaceExportZip } from './constants';

test('navigate to workspace', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  await expect(overview.title).toHaveText('Welcome to Axon Ivy NEO Designer');
  await overview.expectCardsCountGreaterThan(0);
  await overview.card(workspace).click();
  await expect(page.locator(`text=Welcome to your workspace: ${workspace}`)).toBeVisible();
});

test('create and delete workspace', async ({ page, browserName }, testInfo) => {
  const wsName = `${browserName}ws${testInfo.retry}`;
  await Neo.open(page);
  const overview = new Overview(page);
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await page.goBack();
  await overview.deleteCard(wsName, true);
});

test('search workspaces', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  await overview.expectCardsCountGreaterThan(0);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill(workspace);
  await expect(overview.cards).toHaveCount(1);
});

test('deploy workspaces', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  const card = overview.card(workspace);
  await overview.clickCardAction(card, 'Deploy');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Deploy' }).click();
  await expect(dialog.locator('code')).toContainText("Info: Project(s) of file 'export.zip' successful deployed to application 'myApp'");
  await dialog.getByRole('button', { name: 'Close' }).click();
});

test.describe('export', () => {
  test.afterAll(() => {
    rmWorkspaceExportDir();
  });

  test('export', async ({ page }) => {
    const zipFile = workspaceExportZip('simpleExport.zip');
    await Neo.exportWorkspace(page, zipFile);
  });
});
