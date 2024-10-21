import test, { expect } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';

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
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await neo.market();
  await overview.card('Microsoft Excel').click();
  await page.getByRole('dialog').getByRole('button').getByText('Install').click();
  await expect(page.getByRole('status').getByText('Product installed')).toBeVisible();
  await neo.processes();
  await expect(overview.card('WriteExcel')).toBeVisible();
  await page.goto('');
  await overview.deleteCard(wsName, true);
});
