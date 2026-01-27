import { expect, type Page, test } from '@playwright/test';
import crypto from 'crypto';
import { CmsEditor } from '../../page-objects/cms-editor';
import { Neo } from '../../page-objects/neo';
import { APP, TEST_PROJECT } from '../constants';

const openCms = async (page: Page) => {
  const neo = await Neo.openWorkspace(page, `configurations/${APP}/${TEST_PROJECT}/cms`);
  const editor = new CmsEditor(neo, 'cms');
  await editor.expectOpen('/Labels/ReleaseDate');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openCms(page);
});

test.describe('inscription', () => {
  test('change value', async ({ page }) => {
    const { editor } = await openCms(page);
    const coName = `co-${crypto.randomBytes(4).toString('hex')}`;
    const co = await editor.addCo(coName);
    const inscription = await co.openInscription();
    const value = inscription.inscription.getByLabel('English');
    await value.fill('test value');
    await expect(co.row).toHaveText(`/${coName}test value`);
    await editor.editor.getByRole('button', { name: 'Delete Content Object' }).click();
    await expect(co.row).toBeHidden();
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openCms(page);
    const inscription = await editor.rowByName('/Labels/ReleaseDate').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/cms-editor.html/);
  });

  test('open file', async ({ page }) => {
    const { editor, neo } = await openCms(page);
    const inscription = await editor.rowByName('/File/Text').openInscription();
    const pagePromise = neo.page.context().waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: 'Open File' }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/\/cms\/.+\/File\/Text/);
    await expect(newPage.locator('body')).toHaveText('This is a content object file');
  });
});
