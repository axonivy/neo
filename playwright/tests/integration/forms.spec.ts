import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';

test('navigate to forms', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.card('EnterProduct').click();
  await new FormEditor(neo, 'EnterProduct').waitForOpen('Product');
});

test('create and delete from', async ({ page, browserName }, testInfo) => {
  const fromName = `${browserName}ws${testInfo.retry}`;
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.create(fromName, 'test');
  await new FormEditor(neo, fromName).waitForOpen();
  await page.goBack();
  await overview.deleteCard(fromName);
});

test('search forms', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('Enter');
  await expect(overview.cards).toHaveCount(1);
});
