import { expect, Page, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';

const workspace = process.env.WORKSPACE ?? 'designer';
const wsExportDir = path.join('playwright', 'wsExport');

const exportWs = async (page: Page, fileName: string) => {
  const neo = await Neo.open(page);
  const overview = new Overview(page);
  const zipFile = path.join(wsExportDir, fileName);
  await overview.export(workspace, zipFile);
  expect(fs.existsSync(zipFile)).toBeTruthy();
  return { neo, overview, zipFile };
};
const verifyImport = async (overview: Overview, wsName: string, neo: Neo, page: Page) => {
  await page.goto('');
  await overview.card(wsName).click();
  await neo.processes();
  await overview.search.fill('quick');
  await expect(overview.cards).toHaveCount(1);
};

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
  test.afterAll(async () => {
    if (fs.existsSync(wsExportDir)) {
      fs.rm(wsExportDir, { recursive: true }, () => {});
    }
  });

  test('export', async ({ page }) => {
    await exportWs(page, 'simpleExport.zip');
  });

  test('import into existing workspace', async ({ page, browserName }, testInfo) => {
    const { neo, overview, zipFile } = await exportWs(page, 'import.zip');
    const wsName = `${browserName}ws-import${testInfo.retry}`;
    await overview.create(wsName);
    await expect(page.locator(`text=Welcome to your application: ${wsName}`)).toBeVisible();
    await page.goBack();
    await overview.import(wsName, zipFile);

    await verifyImport(overview, wsName, neo, page);
    await page.goto('');
    await overview.deleteCard(wsName, true);
  });

  test('create workspace with import', async ({ page, browserName }, testInfo) => {
    test.skip(browserName === 'webkit' || browserName === 'firefox', 'WebSocket connection problem that only occurs when using vite proxy');
    const { neo, overview, zipFile } = await exportWs(page, 'import-and-create.zip');
    const wsName = `${browserName}ws-create-and-import${testInfo.retry}`;
    await overview.create(wsName, undefined, { file: zipFile });

    await expect(page.locator(`text=Welcome to your application: ${wsName}`)).toBeVisible();

    await verifyImport(overview, wsName, neo, page);
    await page.goto('');
    await overview.deleteCard(wsName, true);
  });
});
