import { test } from '@playwright/test';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';
import { ProcessEditor } from '../page-objects/process-editor';
import { VariableEditor } from '../page-objects/variables-editor';
import { screenshot } from './screenshot-util';

test('process editor', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.card('quickstart').click();
  await new ProcessEditor(neo, 'quickstart').expectOpen('1907DDB3CA766818-f0');
  await screenshot(page, 'editor-process');
});

test('form editor', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.card('EnterProduct').click();
  await new FormEditor(neo, 'EnterProduct').expectOpen('Product');
  await screenshot(page, 'editor-form');
});

test('data class editor', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  await overview.card('QuickStartTutorial').click();
  await new DataClassEditor(neo, 'QuickStartTutorial').expectOpen('product');
  await screenshot(page, 'editor-data-class');
});

test('variable editor', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await overview.card('variables').click();
  await new VariableEditor(neo, 'variables').expectOpen('MyVar');
  await screenshot(page, 'editor-variable');
});
