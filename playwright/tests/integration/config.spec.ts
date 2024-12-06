import { type Page, test } from '@playwright/test';
import { randomUUID } from 'crypto';
import { MonacoEditor } from '../page-objects/monaco-editor';
import { Neo } from '../page-objects/neo';
import { APP, TEST_PROJECT } from './constants';

const openConfig = async (page: Page) => {
  const neo = await Neo.openEditor(page, `configurations/${APP}/${TEST_PROJECT}/cms/cms_de-ch.yaml`);
  const editor = new MonacoEditor(neo, 'cms_de-ch');
  await editor.waitForOpen('ReleaseDate: Release Date');

  return editor;
};

test('restore editor', async ({ page }) => {
  await openConfig(page);
});

test('insert value', async ({ page }) => {
  const editor = await openConfig(page);
  await editor.insertTextOnLine(3, randomUUID());
});
