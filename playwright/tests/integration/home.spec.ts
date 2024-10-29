import { expect, test } from '@playwright/test';
import { AppInfo } from '../page-objects/app-info';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { workspace } from './constants';

test('navigate to home', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.home();
  await overview.expectCardsCountGreaterThan(0);
  const appInfo = new AppInfo(page);
  await expect(appInfo.title).toHaveText(`Welcome to your workspace: ${workspace}`);
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

test('delete project', async ({ page, browserName }, testInfo) => {
  const wsName = `${browserName}delete-project${testInfo.retry}`;
  const neo = await Neo.open(page);
  const overview = new Overview(page);
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await overview.deleteCard(wsName);
  await neo.toast.expectSuccess('Project removed');
  await page.goBack();
  await overview.deleteCard(wsName, true);
});
