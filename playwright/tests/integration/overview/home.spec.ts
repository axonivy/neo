import { expect, test } from '@playwright/test';
import { ImportDialog } from '../../page-objects/import-dialog';
import { Neo } from '../../page-objects/neo';
import { Overview } from '../../page-objects/overview';
import { APP, rmWorkspaceExportDir, TEST_PROJECT, WORKSPACE, workspaceExportZip } from '../constants';

test.afterAll(() => {
  rmWorkspaceExportDir();
});

test('navigate to home', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.home();
  await overview.expectCardsCountGreaterThan(0);
  await expect(overview.title).toHaveCount(2);
  await expect(overview.title.first()).toHaveText(`Welcome to your workspace: ${WORKSPACE}`);
  await expect(overview.title.nth(1)).toHaveText(`Projects`);
  await expect(overview.recentlyOpenedCards).toHaveCount(0);
});

test('recently opened projects', async ({ page }) => {
  const neo = await Neo.openWorkspace(page, `processes/${APP}/${TEST_PROJECT}/processes/quickstart`);
  await neo.controlBar.tab('quickstart').expectActive();
  await Neo.openWorkspace(page, `processes/${APP}/unknown/processes/jump`);
  await neo.controlBar.tab('jump').expectActive();
  const overview = await neo.home();
  await expect(overview.title).toHaveCount(3);
  await expect(overview.title.first()).toHaveText(`Welcome to your workspace: ${WORKSPACE}`);
  await expect(overview.title.nth(1)).toHaveText(`Recently Opened`);
  await expect(overview.title.nth(2)).toHaveText(`Projects`);
  await expect(overview.recentlyOpenedCards).toHaveCount(2);
});

test('search projects', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  const wsName = 'searchProjects';
  await overview.create(wsName);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('test');
  await expect(overview.cards).toHaveCount(1);
});

test('create new Project', async ({ page }) => {
  const neo = await Neo.open(page);
  const overview = new Overview(page);
  const wsName = 'newest';
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await overview.clickCreateProject('Other-Project');
  await neo.toast.expectSuccess('Project successfully created');
  await neo.toast.expectSuccess('Project successfully deployed');
  await overview.deleteCard('Other-Project');
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
  await expect(overview.title.first()).toHaveText(`Project details: ${TEST_PROJECT}`);
});
