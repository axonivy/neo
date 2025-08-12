import { type Page, test } from '@playwright/test';
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
