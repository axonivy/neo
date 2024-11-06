import { expect, type Page, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { VariableEditor } from '../page-objects/variables-editor';
import { app } from './constants';

const openVariables = async (page: Page) => {
  const neo = await Neo.openEditor(page, `configurations/${app}/neo-test-project/config/variables`);
  const editor = new VariableEditor(neo, 'variables');
  await editor.waitForOpen('MyVar');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openVariables(page);
});

test.describe('inscription', () => {
  test('change value', async ({ page }) => {
    const { editor } = await openVariables(page);
    const variable = editor.rowByName('MyVar');
    const inscription = await variable.openInscription();
    const valueInput = inscription.inscription.getByLabel('Value');
    await valueInput.fill('hi');
    await variable.expectValue('hi');
    await valueInput.fill('test');
    await variable.expectValue('test');
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openVariables(page);
    const inscription = await editor.rowByName('MyVar').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/variables.html/);
  });
});
