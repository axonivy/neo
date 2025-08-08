import test, { expect } from '@playwright/test';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { APP, TEST_PROJECT, WORKSPACE } from './constants';

test('editor breadcrumbs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page, `dataclasses/${APP}/${TEST_PROJECT}/dataclasses/neo/test/project/QuickStartTutorial`);
  const editor = new DataClassEditor(neo, 'QuickStartTutorial');
  await editor.expectOpen('product');
  await neo.breadcrumbs.expectItems(['Workspaces', WORKSPACE, 'Data Classes', TEST_PROJECT, 'QuickStartTutorial']);

  await neo.breadcrumbs.item(TEST_PROJECT).last().click();
  const overview = new Overview(page);
  await expect(overview.title).toHaveText('Data Classes');
  await expect(overview.filter.filterTag(TEST_PROJECT)).toBeVisible();
  await neo.breadcrumbs.expectItems(['Workspaces', WORKSPACE, 'Data Classes']);
  await page.goBack();

  await neo.breadcrumbs.item('Data Classes').click();
  await expect(overview.title).toHaveText('Data Classes');
  await expect(overview.filter.filterTag(TEST_PROJECT)).toBeHidden();
  await neo.breadcrumbs.expectItems(['Workspaces', WORKSPACE, 'Data Classes']);

  await neo.breadcrumbs.item(WORKSPACE).click();
  await expect(overview.title).toHaveText('Projects');

  await neo.breadcrumbs.item('Workspaces').click();
  await expect(overview.title).toHaveText('Manage your workspaces');
  await expect(neo.breadcrumbs.navigation).toBeHidden();
});

test('project breadcrumbs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page, `projects/${APP}/${TEST_PROJECT}`);
  const overview = new Overview(page);
  await expect(overview.infoTitle).toHaveText(`Project details: ${TEST_PROJECT}`);
  await neo.breadcrumbs.expectItems(['Workspaces', WORKSPACE, 'Projects', TEST_PROJECT]);

  await neo.breadcrumbs.item(TEST_PROJECT).last().getByRole('button').focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('menu')).toBeVisible();
  // Fixme after create project is supported

  // const otherProject = page.getByRole('menu').getByRole('menuitem', { name: 'quick-start-tutorial' });
  // await expect(otherProject).toBeVisible();
  // await otherProject.click();

  // await expect(overview.infoTitle).toHaveText(`Project details: quick-start-tutorial`);
  // await neo.breadcrumbs.expectItems(['Workspaces', WORKSPACE, 'Projects', 'quick-start-tutorial']);
});
