import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { ProjectDetail } from '../page-objects/project-detail';

test('project detail', async ({ page }) => {
  const project = 'neo-test-project';
  await Neo.openWorkspace(page);
  const overview = new Overview(page);
  await overview.card(project).click();
  const detail = new ProjectDetail(page);
  await expect(detail.title).toHaveText(`Project detail: ${project}`);
  await expect(detail.detailCard).toContainText('Name:neo-test-project');
  await expect(detail.detailCard).toContainText('GroupId:neo.test.project');
  await expect(detail.detailCard).toContainText('Version:12.0.0-SNAPSHOT');
  await expect(detail.detailCard).toContainText('Editing rights:Write');
  await expect(detail.detailCard).toContainText('State:Unpacked');
  await expect(detail.detailCard).toContainText('Deletable:Yes');
});
