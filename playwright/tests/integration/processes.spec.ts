import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { ProcessEditor } from '../page-objects/process-editor';

test('navigate to process', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.hasGroup('Project: neo-test-project');
  await overview.hoverCard('jump', 'processes/jump');
  await overview.card('quickstart').click();
  await new ProcessEditor(neo, 'quickstart').waitForOpen('1907DDB3CA766818-f0');
});

test('create and delete process', async ({ page, browserName }, testInfo) => {
  const processName = `${browserName}ws${testInfo.retry}`;
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.create(processName);
  await new ProcessEditor(neo, processName).waitForOpen();
  await page.goBack();
  await overview.deleteCard(processName);
});

test('search processes', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('quick');
  await expect(overview.cards).toHaveCount(1);
  await page.reload();
  expect(page.url()).toContain('?search=quick');
  await expect(overview.cards).toHaveCount(1);
});
