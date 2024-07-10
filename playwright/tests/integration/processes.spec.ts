import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { ProcessEditor } from '../page-objects/process-editor';

test('navigate to process', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.card('quickstart').click();
  await new ProcessEditor(neo, 'quickstart').waitForOpen('1907DDB3CA766818-f0');
});

test('create and delete process', async ({ page }, testInfo) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  if (testInfo.retry === 0) {
    await overview.create('newproc');
  } else {
    await overview.card('newproc').click();
  }
  await new ProcessEditor(neo, 'newproc').waitForOpen();

  await page.goBack();
  await expect(overview.card('newproc')).toBeVisible();
  await overview.deleteCard('newproc');
  await expect(overview.card('newproc')).toBeHidden();
});

test('search processes', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);

  await overview.search.fill('quick');
  await expect(overview.cards).toHaveCount(1);
});
