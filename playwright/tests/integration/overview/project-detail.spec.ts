import { expect, test, type Page } from '@playwright/test';
import { Neo } from '../../page-objects/neo';
import { Overview } from '../../page-objects/overview';
import { ProjectDetail } from '../../page-objects/project-detail';
import { APP, rmWorkspaceExportDir, TEST_PROJECT } from '../constants';

test.afterAll(() => {
  rmWorkspaceExportDir();
});

test('project detail', async ({ page }) => {
  await Neo.openWorkspace(page);
  const { overview, detail } = await projectDetail(page);
  await expect(overview.title).toHaveCount(2);
  await expect(overview.title.nth(1)).toHaveText('Dependency');
  await expect(overview.recentlyOpenedCards).toHaveCount(0);
  await expect(detail.detailCard).toContainText(`ArtifactId:${TEST_PROJECT}`);
  await expect(detail.detailCard).toContainText('GroupId:neo.test.project');
  await expect(detail.detailCard).toContainText(/Version:\d+.\d+.\d+-SNAPSHOT/);
  await expect(detail.detailCard).toContainText('Editing rights:Editable');
  await expect(detail.detailCard).toContainText('Deletable:Yes');
  await overview.clickInfoCard('Processes');
  await overview.clickInfoCard('Data Classes');
  await overview.clickInfoCard('Forms');
  await overview.clickInfoCard('Configurations');
});

test('recently opened', async ({ page }) => {
  const neo = await Neo.openWorkspace(page, `processes/${APP}/${TEST_PROJECT}/processes/quickstart`);
  await neo.controlBar.tab('quickstart').expectActive();
  await Neo.openWorkspace(page, `processes/${APP}/unknown/processes/jump`);
  await neo.controlBar.tab('jump').expectActive();
  await neo.home();
  const { overview } = await projectDetail(page);
  await expect(overview.title).toHaveCount(3);
  await expect(overview.title.nth(1)).toHaveText('Recently Opened');
  await expect(overview.title.nth(2)).toHaveText('Dependency');
  await expect(overview.recentlyOpenedCards).toHaveCount(1);
});

test('add and remove dependency', async ({ page, browserName }, testInfo) => {
  const neo = await Neo.open(page);
  const overview = neo.overview;
  const wsName = `${browserName}dependency_ws${testInfo.retry}`;
  await overview.create(wsName);
  await expect(page.getByText(`Welcome to your workspace: ${wsName}`)).toBeVisible();
  await overview.clickCreateProject('dependency-project');
  await overview.card(wsName).click();
  await expect(overview.cards).toHaveCount(0);
  await overview.createButton.getByText('Add new Dependency').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('combobox')).toHaveText('dependency-project');
  await dialog.getByRole('button', { name: 'Add' }).click();
  await neo.toast.expectSuccess('Added dependency');
  await expect(overview.cards).toHaveCount(1);
  await overview.deleteCard('dependency-project', false, 'Remove Dependency');
  await neo.toast.expectSuccess('Dependency removed');
  await expect(overview.cards).toHaveCount(0);
  await page.goto('');
  await overview.deleteCard(wsName, true);
});

async function projectDetail(page: Page) {
  const overview = new Overview(page);
  await overview.card(TEST_PROJECT).click();
  const detail = new ProjectDetail(page);
  await expect(overview.title.first()).toHaveText(`Project details: ${TEST_PROJECT}`);
  return { overview, detail };
}
