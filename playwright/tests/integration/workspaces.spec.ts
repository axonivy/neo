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
  await expect(page.locator(`text=Welcome to your application: ${workspace}`)).toBeVisible();
});

test('create and delete workspace', async ({ page, browserName }, testInfo) => {
  const wsName = `${browserName}ws${testInfo.retry}`;
  await Neo.open(page);
  const overview = new Overview(page);
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your application: ${wsName}`)).toBeVisible();
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

test.describe('export & import', () => {
  test.afterAll(() => {
    rmWorkspaceExportDir();
  });

  test('export', async ({ page }) => {
    const zipFile = workspaceExportZip('simpleExport.zip');
    await Neo.exportWorkspace(page, zipFile);
  });

  test('create workspace with import', async ({ page, browserName }, testInfo) => {
    test.skip(browserName === 'webkit' || browserName === 'firefox', 'WebSocket connection problem that only occurs when using vite proxy');
    const zipFile = workspaceExportZip('import-and-create.zip');
    const { neo, overview } = await Neo.exportWorkspace(page, zipFile);
    const wsName = `${browserName}ws-create-and-import${testInfo.retry}`;
    await overview.create(wsName, undefined, { file: zipFile });
    await expect(page.locator(`text=Welcome to your application: ${wsName}`)).toBeVisible();
    await page.goto('');
    await overview.card(wsName).click();
    await neo.processes();
    await overview.search.fill('quick');
    await expect(overview.cards).toHaveCount(1);
    await page.goto('');
    await overview.deleteCard(wsName, true);
  });
});
