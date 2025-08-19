import { expect, test } from '@playwright/test';
import { Neo } from '~/page-objects/neo';
import { Overview } from '~/page-objects/overview';
import { ProcessEditor } from '~/page-objects/process-editor';

test('search market', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.home();
  await overview.clickMarketImport();
  await overview.search.fill('blahahahah');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('swiss phone di');
  await expect(overview.cards).toHaveCount(1);
});

test('install from market', async ({ page, browserName }, testInfo) => {
  const wsName = `${browserName}market_ws${testInfo.retry}`;
  const neo = await Neo.open(page);
  const overview = new Overview(page);
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await overview.clickMarketImport();
  await overview.card('Microsoft Excel').click();
  await page.getByRole('dialog').getByRole('button').getByText('Install').click();
  await neo.toast.expectSuccess('Imported projects: excel-connector-demo, excel-connector');
  const editor = new ProcessEditor(neo, 'ExcelConnectorDemo');
  await editor.expectOpen();
  await neo.navigation.open('Processes');
  await overview.hasCardWithTag('WriteExcel', 'Read only');
  await page.goto('');
  await overview.deleteCard(wsName, true);
});
