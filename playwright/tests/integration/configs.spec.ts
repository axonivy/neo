import { expect, test } from '@playwright/test';
import { CmsEditor } from '../page-objects/cms-editor';
import { Neo } from '../page-objects/neo';
import { VariableEditor } from '../page-objects/variables-editor';

test('navigate to configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await overview.card('variables').click();
  await new VariableEditor(neo, 'variables').expectOpen('MyVar');
  await neo.configs();
  await overview.card('cms').click();
  await new CmsEditor(neo, 'cms').expectOpen('/Labels/ReleaseDate');
});

test('search configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await expect(overview.cards).toHaveCount(2);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);

  await overview.search.fill('cms');
  await expect(overview.cards).toHaveCount(1);
});
