import test, { expect } from '@playwright/test';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { APP, TEST_PROJECT } from './constants';

test('navigate via breadcrumbs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page, `dataclasses/${APP}/${TEST_PROJECT}/dataclasses/neo/test/project/QuickStartTutorial`);
  const editor = new DataClassEditor(neo, 'QuickStartTutorial');
  await editor.expectOpen('product');
  await neo.breadcrumbs.expectItems(['Workspaces', 'neo-test-project', 'Data Classes', 'neo-test-project', 'QuickStartTutorial']);

  await neo.breadcrumbs.item('Data Classes').click();
  const overview = new Overview(page);
  await expect(overview.title).toHaveText('Data Classes');
  await neo.breadcrumbs.expectItems(['Workspaces', 'neo-test-project', 'Data Classes']);

  await neo.breadcrumbs.item('neo-test-project').click();
  await expect(overview.title).toHaveText('Projects');

  await neo.breadcrumbs.item('Workspaces').click();
  await expect(overview.title).toHaveText('Manage your workspaces');
  await expect(neo.breadcrumbs.navigation).toBeHidden();
});
