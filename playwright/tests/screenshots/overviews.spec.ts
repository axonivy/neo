import { expect, test } from '@playwright/test';
import { TEST_PROJECT } from '../integration/constants';
import { AppInfo } from '../page-objects/app-info';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { ProjectDetail } from '../page-objects/project-detail';
import { screenshot } from './screenshot-util';

test('workspaces', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  await expect(page.getByText('Welcome to Axon Ivy NEO Designer')).toBeVisible();
  await overview.expectCardsCountGreaterThan(0);
  await screenshot(page, 'overview-workspaces');
});

test('home', async ({ page }) => {
  await Neo.openWorkspace(page);
  const overview = new Overview(page);
  const appInfo = new AppInfo(page);
  await expect(appInfo.title).toHaveText(/Welcome to your workspace/);
  await expect(appInfo.infoCards).toHaveCount(4);
  await overview.expectCardsCountGreaterThan(0);
  await screenshot(page, 'overview-home', { width: 900, height: 900 });
});

test('project', async ({ page }) => {
  await Neo.openWorkspace(page);
  const overview = new Overview(page);
  await overview.card(TEST_PROJECT).click();
  const detail = new ProjectDetail(page);
  await expect(detail.title).toHaveText(/Project details/);
  await expect(detail.detailCard).toContainText(`ArtifactId:${TEST_PROJECT}`);
  await screenshot(page, 'overview-project');
});

test('market', async ({ page }) => {
  await Neo.openWorkspace(page);
  const projects = new Overview(page);
  await projects.clickMarketImport();
  const market = new Overview(page);
  await expect(market.title).toHaveText(/Axon Ivy Market/);
  await market.expectCardsCountGreaterThan(0);
  await screenshot(page, 'overview-market');
});

test('processes', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.processes();
  await screenshot(page, 'overview-processes');
});

test('forms', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.forms();
  await screenshot(page, 'overview-forms');
});

test('data classes', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.dataClasses();
  await screenshot(page, 'overview-data-classes');
});

test('configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.configs();
  await screenshot(page, 'overview-configs');
});
