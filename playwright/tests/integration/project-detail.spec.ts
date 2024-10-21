import { expect, test } from '@playwright/test';
import { ImportDialog } from '../page-objects/import-dialog';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { ProjectDetail } from '../page-objects/project-detail';
import { rmWorkspaceExportDir, workspaceExportZip } from './constants';

test.afterAll(() => {
  rmWorkspaceExportDir();
});

test('project detail', async ({ page }) => {
  const project = 'neo-test-project';
  await Neo.openWorkspace(page);
  const overview = new Overview(page);
  await overview.card(project).click();
  const detail = new ProjectDetail(page);
  await expect(detail.title).toHaveText(`Project details: ${project}`);
  await expect(detail.detailCard).toContainText('Name:neo-test-project');
  await expect(detail.detailCard).toContainText('GroupId:neo.test.project');
  await expect(detail.detailCard).toContainText('Version:12.0.0-SNAPSHOT');
  await expect(detail.detailCard).toContainText('Editing rights:Write');
  await expect(detail.detailCard).toContainText('State:Unpacked');
  await expect(detail.detailCard).toContainText('Deletable:Yes');
});

test('add and remove dependency', async ({ page, browserName }, testInfo) => {
  const zipFile = workspaceExportZip('dependency.zip');
  const { overview, neo } = await Neo.exportWorkspace(page, zipFile);
  const wsName = `${browserName}dependency-ws${testInfo.retry}`;
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await neo.fileImport();
  await new ImportDialog(page).import(zipFile);
  await overview.card(wsName).click();
  await expect(overview.cards).toHaveCount(0);
  await overview.newCard.getByText('Add new Dependency').click();
  const dialog = page.getByRole('dialog');
  await expect(dialog.getByRole('combobox')).toHaveText('neo-test-project');
  await dialog.getByRole('button', { name: 'Add' }).click();
  await neo.toast.expectSuccess('Added dependency');
  await expect(overview.cards).toHaveCount(1);
  await overview.deleteCard('neo-test-project');
  await neo.toast.expectSuccess('Dependency removed');
  await expect(overview.cards).toHaveCount(0);
  await page.goto('');
  await overview.deleteCard(wsName, true);
});
