import { expect, test } from '@playwright/test';
import { randomUUID } from 'crypto';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';

let neo: Neo;
let overview: Overview;

test.beforeEach(async ({ page }) => {
  neo = await Neo.openWorkspace(page);
  overview = await neo.dataClasses();
});

test('navigate to data classes', async () => {
  const dataClassName = 'QuickStartTutorial';
  await overview.card(dataClassName).click();
  await new DataClassEditor(neo, dataClassName).waitForOpen('releaseDate');
});

test('create and delete data class', async () => {
  const dataClassName = `dataClass${randomUUID().replaceAll('-', '')}`;
  await overview.create(dataClassName, 'temp', { project: 'neo-test-project' });
  await new DataClassEditor(neo, dataClassName).waitForOpen();
  await neo.page.goBack();
  await overview.deleteCard(dataClassName);
  await expect(overview.card(dataClassName)).toBeHidden();
});

test('search data classes', async () => {
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('quick');
  await expect(overview.cards).toHaveCount(1);
});

test.describe('inscription', async () => {
  test('add and delete field', async () => {
    const dataClassName = `dataClass${randomUUID().replaceAll('-', '')}`;
    await overview.create(dataClassName, 'temp', { project: 'neo-test-project' });

    const editor = new DataClassEditor(neo, dataClassName);
    await editor.waitForOpen();

    await expect(editor.rows).toHaveCount(0);
    await editor.addField();
    await expect(editor.rows).toHaveCount(1);
    await editor.deleteField();
    await expect(editor.rows).toHaveCount(0);
  });
});
