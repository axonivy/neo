import { expect, type Page, test } from '@playwright/test';
import { randomInt } from 'crypto';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { Neo } from '../page-objects/neo';
import { APP, TEST_PROJECT } from './constants';

const openDataClass = async (page: Page) => {
  const neo = await Neo.openEditor(page, `dataclasses/${APP}/${TEST_PROJECT}/dataclasses/neo/test/project/QuickStartTutorial`);
  const editor = new DataClassEditor(neo, 'QuickStartTutorial');
  await editor.expectOpen('product');
  return { neo, editor };
};

const openFormDataClass = async (page: Page) => {
  const neo = await Neo.openEditor(page, `dataclasses/${APP}/${TEST_PROJECT}/src_hd/neo/test/project/EnterProduct/EnterProductData`);
  const editor = new DataClassEditor(neo, 'EnterProductData');
  await editor.expectOpen('data');
  return { neo, editor };
};

const openTempDataClass = async (page: Page) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  const dataClassName = `dc${randomInt(10000)}`;
  await overview.create(dataClassName, 'temp', { project: TEST_PROJECT });
  const editor = new DataClassEditor(neo, dataClassName);
  await editor.expectOpen();
  const removeTempDataClass = async () => {
    const overview = await neo.dataClasses();
    await overview.deleteCard(dataClassName);
  };
  return { neo, editor, removeTempDataClass };
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

test.describe('inscription', () => {
  test('add and delete field', async ({ page }) => {
    const { editor, removeTempDataClass } = await openTempDataClass(page);
    await expect(editor.rows).toHaveCount(0);
    await editor.addField();
    await expect(editor.rows).toHaveCount(1);
    await editor.rows.nth(0).click();
    await editor.deleteField();
    await expect(editor.rows).toHaveCount(0);
    await removeTempDataClass();
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openDataClass(page);
    const inscription = await editor.rowByName('product').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/data-classes.html/);
  });
});
