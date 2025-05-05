import { test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { screenshot } from './screenshot-util';

test('browser', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.browser();
  await screenshot(page, 'view-browser');
});

test('settings', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.navigation.openSettings();
  await screenshot(page, 'view-settings', { width: 500, height: 400 });
});

test('runtime-log', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.views.openView('Runtime Log');
  await screenshot(page, 'runtime-log');
});
