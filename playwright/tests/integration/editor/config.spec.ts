import { expect, test } from '@playwright/test';
import { randomUUID } from 'crypto';
import { MonacoEditor } from '../../page-objects/monaco-editor';
import { Neo } from '../../page-objects/neo';
import { APP, TEST_PROJECT } from '../constants';

test('restore editor and insert value', async ({ page }) => {
  const neo = await Neo.openWorkspace(page, `configurations/${APP}/${TEST_PROJECT}/cms/cms_en.yaml`);
  const editor = new MonacoEditor(neo, 'cms_en');
  await editor.expectOpen('ReleaseDate: Release Date');
  const lineContent = `NewLabel: ${randomUUID()}`;
  await editor.insertTextOnLine(3, lineContent);
  await editor.cleanLine(3);
  await expect(editor.editor).not.toContainText(lineContent);
});
