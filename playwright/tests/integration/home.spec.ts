import { expect, test } from '@playwright/test';
import { AppInfo } from '../page-objects/app-info';
import { ImportDialog } from '../page-objects/import-dialog';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { workspace } from './constants';

test('navigate to home', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.home();
  await overview.expectCardsCountGreaterThan(0);
  const appInfo = new AppInfo(page);
  await expect(appInfo.title).toHaveText(`Welcome to your application: ${workspace}`);
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

test('click market', async ({ page }) => {
  await Neo.openWorkspace(page);
  const overview = new Overview(page);
  const marketCard = overview.newCard.getByText('Market');
  await marketCard.click();
  const marketOverview = new Overview(page);
  await expect(marketOverview.title).toHaveText('Axon Ivy Market');
});

test('click import', async ({ page }) => {
  await Neo.openWorkspace(page);
  const overview = new Overview(page);
  const importCard = overview.newCard.getByText('File Import');
  await importCard.click();
  const dialog = new ImportDialog(page);
  await expect(dialog.title).toHaveText(`Import Axon Ivy Projects into: ${workspace}`);
});
