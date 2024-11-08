import { expect, type Page, test } from '@playwright/test';
import { randomUUID } from 'crypto';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { Neo } from '../page-objects/neo';
import { TEST_PROJECT } from './constants';

const openDataClasses = async (page: Page) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  return { neo, overview };
};

test('navigate to data classes', async ({ page }) => {
  const { neo, overview } = await openDataClasses(page);
  await overview.hasGroup(`Project: ${TEST_PROJECT}`);
  const dataClassName = 'QuickStartTutorial';
  await overview.card(dataClassName).click();
  await new DataClassEditor(neo, dataClassName).waitForOpen('releaseDate');
});

test('create and delete data class', async ({ page }) => {
  const { neo, overview } = await openDataClasses(page);
  const dataClassName = `dataClass${randomUUID().replaceAll('-', '')}`;
  await overview.create(dataClassName, 'temp', { project: TEST_PROJECT });
  await new DataClassEditor(neo, dataClassName).waitForOpen();
  await neo.page.goBack();
  await overview.deleteCard(dataClassName);
  await expect(overview.card(dataClassName)).toBeHidden();
});

test('search data classes', async ({ page }) => {
  const { overview } = await openDataClasses(page);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('quick');
  await expect(overview.cards).toHaveCount(1);
});
