import test, { expect } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';

test('navigate to market', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.market();
});

test('search market', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.market();
  await overview.search.fill('blahahahah');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('swiss phone di');
  await expect(overview.cards).toHaveCount(1);
});

test('install from market', async ({ page, browserName }, testInfo) => {
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
  await Neo.open(page);
  await overview.deleteCard(wsName, true);
});
