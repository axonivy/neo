import { expect, test } from '@playwright/test';
import { AppInfo } from '../page-objects/app-info';
import { ImportDialog } from '../page-objects/import-dialog';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { ProjectDetail } from '../page-objects/project-detail';
import { rmWorkspaceExportDir, TEST_PROJECT, WORKSPACE, workspaceExportZip } from './constants';

test.afterAll(() => {
  rmWorkspaceExportDir();
});

test('navigate to home', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.home();
  await overview.expectCardsCountGreaterThan(0);
  const appInfo = new AppInfo(page);
  await expect(appInfo.title).toHaveText(`Welcome to your workspace: ${WORKSPACE}`);
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

test('import and delete project', async ({ page, browserName }, testInfo) => {
  const zipFile = workspaceExportZip('importMe.zip');
  const { overview, neo } = await Neo.exportWorkspace(page, zipFile);
  const wsName = `${browserName}_idp_${testInfo.retry}`;
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await overview.clickFileImport();
  await new ImportDialog(page).import(zipFile);
  await page.keyboard.press('Escape');
  await neo.navigation.open('Processes');
  await overview.hasGroup(`Project: ${wsName}`);
  await overview.openGroup(TEST_PROJECT);
  await expect(overview.card('quickstart')).toBeVisible();
  await neo.home();
  await overview.deleteCard(TEST_PROJECT);
  await neo.toast.expectSuccess('Project removed');
  await page.goto('');
  await overview.deleteCard(wsName, true);
});

test('project graph', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await page.evaluate(() => {
    document.body.style.zoom = '75%';
  });
  const overview = await neo.home();
  await overview.viewToggle.getByRole('radio', { name: 'Graph View' }).click();

  const graph = overview.graph;
  await graph.horizontalAlignButton.click();
  await expect(graph.edges).toHaveCount(0);
  await expect(graph.nodes).toHaveCount(1);

  const neoTestProjectNode = graph.getNodeByText('neo-test-project');
  await neoTestProjectNode.expandNode.click();
  await expect(neoTestProjectNode.node).toContainText('neo-test-projectneo-test-project');

  await neoTestProjectNode.jumpInto.click();
  const detail = new ProjectDetail(page);
  await expect(detail.title).toHaveText(`Project details: ${TEST_PROJECT}`);
});
