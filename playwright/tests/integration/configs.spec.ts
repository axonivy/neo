import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { VariableEditor } from '../page-objects/variables-editor';

test('navigate to configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await overview.hasGroup('Project: neo-test-project', '', 0);
  await overview.card('variables').click();
  await new VariableEditor(neo, 'variables').waitForOpen('MyVar');
});

test('search configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);

  await overview.search.fill('neo-test-project');
  await expect(overview.cards).toHaveCount(1);
});
