import { expect, Page, test } from '@playwright/test';
import { randomUUID } from 'crypto';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { Neo } from '../page-objects/neo';

const openDataClasses = async (page: Page) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  return { neo, overview };
};

test('navigate to data classes', async ({ page }) => {
  const { neo, overview } = await openDataClasses(page);
  await overview.hasGroup('neo-test-project');
  const dataClassName = 'QuickStartTutorial';
  await overview.card(dataClassName).click();
  await new DataClassEditor(neo, dataClassName).waitForOpen('releaseDate');
});

test('create and delete data class', async ({ page }) => {
  const { neo, overview } = await openDataClasses(page);
  const dataClassName = `dataClass${randomUUID().replaceAll('-', '')}`;
  await overview.create(dataClassName, 'temp', { project: 'neo-test-project' });
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
