import { expect, test } from '@playwright/test';
import { ImportDialog } from '../page-objects/import-dialog';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { ProjectDetail } from '../page-objects/project-detail';
import { rmWorkspaceExportDir, TEST_PROJECT, workspaceExportZip } from './constants';

test.afterAll(() => {
  rmWorkspaceExportDir();
});

test('project detail', async ({ page }) => {
  await Neo.openWorkspace(page);
  const overview = new Overview(page);
  await overview.card(TEST_PROJECT).click();
  const detail = new ProjectDetail(page);
  await expect(overview.infoTitle).toHaveText(`Project details: ${TEST_PROJECT}`);
  await expect(detail.detailCard).toContainText(`ArtifactId:${TEST_PROJECT}`);
  await expect(detail.detailCard).toContainText('GroupId:neo.test.project');
  await expect(detail.detailCard).toContainText(/Version:\d+.\d+.\d+-SNAPSHOT/);
  await expect(detail.detailCard).toContainText('Editing rights:Editable');
  await expect(detail.detailCard).toContainText('Deletable:Yes');
});

test('add and remove dependency', async ({ page, browserName }, testInfo) => {
  const zipFile = workspaceExportZip('dependency.zip');
  const { overview, neo } = await Neo.exportWorkspace(page, zipFile);
  const wsName = `${browserName}dependency_ws${testInfo.retry}`;
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await overview.clickFileImport();
  await new ImportDialog(page).import(zipFile);
  await page.keyboard.press('Escape');
  await overview.card(wsName).click();
  await expect(overview.cards).toHaveCount(0);
  await overview.createButton.getByText('Add new Dependency').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('combobox')).toHaveText(TEST_PROJECT);
  await dialog.getByRole('button', { name: 'Add' }).click();
  await neo.toast.expectSuccess('Added dependency');
  await expect(overview.cards).toHaveCount(1);
  await overview.deleteCard(TEST_PROJECT, false, 'Remove Dependency');
  await neo.toast.expectSuccess('Dependency removed');
  await expect(overview.cards).toHaveCount(0);
  await page.goto('');
  await overview.deleteCard(wsName, true);
});
