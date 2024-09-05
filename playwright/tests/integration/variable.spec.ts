import { Page, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { VariableEditor } from '../page-objects/variables-editor';
import { app } from './app';

const openVariables = async (page: Page) => {
  const neo = await Neo.openEditor(page, `configurations/${app}/neo-test-project/variables`);
  const editor = new VariableEditor(neo, 'variables');
  await editor.waitForOpen('MyVar');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openVariables(page);
});

test.describe('inscription', () => {
  test('Change value', async ({ page }) => {
    const { editor } = await openVariables(page);
    const variable = editor.rowByName('MyVar');
    const inscription = await variable.openInscription();
    const valueInput = inscription.inscription.getByLabel('Value');
    await valueInput.fill('hi');
    await variable.expectValue('hi');
    await valueInput.fill('test');
    await variable.expectValue('test');
  });
});
