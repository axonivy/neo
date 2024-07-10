import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';

test('navigate to forms', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.card('EnterProduct').click();
  await new FormEditor(neo, 'EnterProduct').waitForOpen('Product');
});

test('create and delete from', async ({ page }, testInfo) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  if (testInfo.retry === 0) {
    await overview.create('newform', 'test');
  } else {
    await overview.card('newform').click();
  }
  await new FormEditor(neo, 'newform').waitForOpen();

  await page.goBack();
  await expect(overview.card('newform')).toBeVisible();
  await overview.deleteCard('newform');
  await expect(overview.card('newform')).toBeHidden();
});

test('search forms', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);

  await overview.search.fill('Enter');
  await expect(overview.cards).toHaveCount(1);
});
