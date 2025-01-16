import { expect, test, type Page } from '@playwright/test';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';
import { VariableEditor } from '../page-objects/variables-editor';

test('editor hotkeys', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const forms = await neo.forms();
  await forms.card('EnterProduct').click();
  await new FormEditor(neo, 'EnterProduct').expectOpen('Product');
  await assertDialog(page, 'Create from data');

  const dataClasses = await neo.dataClasses();
  await dataClasses.card('QuickStartTutorial').click();
  await new DataClassEditor(neo, 'QuickStartTutorial').expectOpen('releaseDate');
  await assertDialog(page, 'Create Attribute');

  const variables = await neo.configs();
  await variables.card('variables').click();
  await new VariableEditor(neo, 'variables').expectOpen('MyVar');
  await assertDialog(page, 'Create Variable');

  await neo.forms();
  await page.keyboard.press('a');
  await expect(page.getByRole('dialog')).toBeHidden();
});

const assertDialog = async (page: Page, text: string) => {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeHidden();
  await page.keyboard.press('a');
  await expect(dialog).toHaveCount(1);
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText(text);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
};
