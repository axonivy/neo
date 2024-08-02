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
    await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
    await page.goBack();
    await overview.import(wsName, zipFile);

    await page.reload();
    await overview.card(wsName).click();
    await neo.processes();
    await overview.search.fill('quick');
    await expect(overview.cards).toHaveCount(1);
    await Neo.open(page);
    await overview.deleteCard(wsName, true);
  });

  test('create workspace with import', async ({ page, browserName }, testInfo) => {
    const { neo, overview, zipFile } = await exportWs(page, 'imoport-and-create.zip');
    const wsName = `${browserName}ws-create-and-import${testInfo.retry}`;
    await overview.create(wsName, undefined, zipFile);

    await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
    await page.goBack();

    await overview.card(wsName).click();
    await neo.processes();
    await overview.search.fill('quick');
    await expect(overview.cards).toHaveCount(1);
    await Neo.open(page);
    await overview.deleteCard(wsName, true);
  });
});
