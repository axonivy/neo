import { expect, test } from '@playwright/test';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { Neo } from '../page-objects/neo';

test('navigate to data classes', async ({ page }) => {
  const dataClassName = 'QuickStartTutorial';
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  await overview.card(dataClassName).click();
  await new DataClassEditor(neo, dataClassName).waitForOpen('releaseDate');
});

test('create and delete data class', async ({ page, browserName }, testInfo) => {
  const dataClassName = `${browserName}dataClass${testInfo.retry}`;
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  await overview.create(dataClassName, 'hello.test');
  await new DataClassEditor(neo, dataClassName).waitForOpen();
  await page.goBack();
  await overview.deleteCard(dataClassName);
});

test('search data classes', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('quick');
  await expect(overview.cards).toHaveCount(1);
});
