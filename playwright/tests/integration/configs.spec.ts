import { expect, test } from '@playwright/test';
import { MonacoEditor } from '../page-objects/monaco-editor';
import { Neo } from '../page-objects/neo';
import { VariableEditor } from '../page-objects/variables-editor';
import { TEST_PROJECT } from './constants';

test('navigate to configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await overview.hasGroup(`Project: ${TEST_PROJECT}`, '', 0);
  await overview.card('variables').click();
  await new VariableEditor(neo, 'variables').expectOpen('MyVar');
  await neo.configs();
  await overview.card('cms_de-ch').click();
  await new MonacoEditor(neo, 'cms_de-ch').expectOpen('ReleaseDate: Release Date');
});

test('search configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await expect(overview.cards).toHaveCount(3);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);

  await overview.search.fill('cms');
  await expect(overview.cards).toHaveCount(2);
});
