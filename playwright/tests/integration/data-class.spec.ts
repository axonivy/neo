import { expect, type Page, test } from '@playwright/test';
import { randomUUID } from 'crypto';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { Neo } from '../page-objects/neo';
import { app } from './constants';

const openDataClass = async (page: Page) => {
  const neo = await Neo.openEditor(page, `dataclasses/${app}/neo-test-project/dataclasses/neo/test/project/QuickStartTutorial`);
  const editor = new DataClassEditor(neo, 'QuickStartTutorial');
  await editor.waitForOpen('product');
  return { neo, editor };
};

const openFormDataClass = async (page: Page) => {
  const neo = await Neo.openEditor(page, `dataclasses/${app}/neo-test-project/src_hd/neo/test/project/EnterProduct/EnterProductData`);
  const editor = new DataClassEditor(neo, 'EnterProductData');
  await editor.waitForOpen('data');
  return { neo, editor };
};

const openTempDataClass = async (page: Page) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  const dataClassName = `dataClass${randomUUID().replaceAll('-', '')}`;
  await overview.create(dataClassName, 'temp', { project: 'neo-test-project' });
  const editor = new DataClassEditor(neo, dataClassName);
  await editor.waitForOpen();
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  const { editor } = await openDataClass(page);
  await expect(editor.editor.getByRole('button', { name: 'Open Form' })).toBeHidden();
  await expect(editor.editor.getByRole('button', { name: 'Open Process' })).toBeHidden();
});

test.describe('jump to editor', () => {
  test('jump to form', async ({ page }) => {
    const { neo, editor } = await openFormDataClass(page);
    await editor.editor.getByRole('button', { name: 'Open Form' }).click();
    await neo.controlBar.tab(/EnterProduct$/).expectActive();
  });

  test('jump to process', async ({ page }) => {
    const { neo, editor } = await openFormDataClass(page);
    await editor.editor.getByRole('button', { name: 'Open Process' }).click();
    await neo.controlBar.tab(/EnterProduct$/).expectActive();
  });
});

test.describe('inscription', async () => {
  test('add and delete field', async ({ page }) => {
    const { editor } = await openTempDataClass(page);
    await expect(editor.rows).toHaveCount(0);
    await editor.addField();
    await expect(editor.rows).toHaveCount(1);
    await editor.deleteField();
    await expect(editor.rows).toHaveCount(0);
  });
});
