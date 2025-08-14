import test, { expect, type Page } from '@playwright/test';
import { Browser } from '../../page-objects/browser';
import { DataClassEditor } from '../../page-objects/data-class-editor';
import { FormEditor } from '../../page-objects/form-editor';
import { Neo } from '../../page-objects/neo';
import { ProcessEditor } from '../../page-objects/process-editor';
import { VariableEditor } from '../../page-objects/variables-editor';
import { APP, TEST_PROJECT } from '../constants';

test('navigate overviews and focus searchinput', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.home();
  await expect(overview.title.last()).toHaveText('Projects');

  await page.keyboard.press('Alt+ControlOrMeta+P');
  await expect(overview.title.last()).toHaveText('Processes');
  await expect(overview.search).toBeFocused();

  await page.keyboard.press('Alt+ControlOrMeta+D');
  await expect(overview.title.last()).toHaveText('Data Classes');
  await expect(overview.search).toBeFocused();

  await page.keyboard.press('Alt+ControlOrMeta+F');
  await expect(overview.title.last()).toHaveText('Forms');
  await expect(overview.search).toBeFocused();

  await page.keyboard.press('Alt+ControlOrMeta+C');
  await expect(overview.title.last()).toHaveText('Configurations');
  await expect(overview.search).toBeFocused();

  await page.keyboard.press('Alt+ControlOrMeta+W');
  await expect(overview.title.last()).toHaveText('Projects');
  await expect(overview.search).toBeFocused();
});

test('focus nav and tabs and nav tabs with arrowkey', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.card('EnterProduct').click();
  await new FormEditor(neo, 'EnterProduct').expectOpen('Product');

  await page.keyboard.press('Alt+Shift+2');
  await expect(neo.navigation.navBar.getByRole('button').first()).toBeFocused();

  await page.keyboard.press('Alt+Shift+1');
  await new FormEditor(neo, 'EnterProduct').expectOpen('Product');

  await page.keyboard.press('ArrowRight');
  await new ProcessEditor(neo, 'EnterProductProcess').expectOpen('1907DDC2CCF1790F-f0');

  await page.keyboard.press('ArrowRight');
  await new DataClassEditor(neo, 'EnterProductData').expectOpen('data');
});

test('open add and delete dialog', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await expect(overview.search).toBeFocused();

  await page.keyboard.press('Tab');
  await page.keyboard.press('A');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const title = dialog.locator('h2', { hasText: /^New Form$/ });
  await expect(title).toBeVisible();
  await dialog.focus();
  await page.keyboard.press('Alt+ControlOrMeta+D');
  await expect(overview.title.last()).toHaveText('Forms');

  await page.keyboard.press('Escape');

  await overview.card('EnterProduct').locator('.card').focus();
  await page.keyboard.press('Delete');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('p', { hasText: 'Are you sure you want to delete this form?' })).toBeVisible();
});

test('open dialog inside editor deactivates shortcuts', async ({ page }) => {
  const neo = await Neo.openWorkspace(page, `dataclasses/${APP}/${TEST_PROJECT}/src_hd/neo/test/project/EnterProduct/EnterProductData`);
  const editor = new DataClassEditor(neo, 'EnterProductData');
  await editor.expectOpen('data');

  await page.keyboard.press('A');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const title = dialog.locator('h2', { hasText: /^Add Attribute$/ });
  await expect(title).toBeVisible();
  await dialog.focus();
  await page.keyboard.press('Alt+ControlOrMeta+D');
  await expect(editor.editor.locator('.dataclass-editor-main-toolbar', { hasText: 'Data Class - EnterProductData' })).toBeVisible();
});

test('import project', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.home();

  await page.keyboard.press('M');
  await expect(overview.title.last()).toHaveText('Axon Ivy Market');

  await neo.home();
  await page.keyboard.press('Tab');
  await page.keyboard.press('I');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2', { hasText: 'Import Axon Ivy Projects into: ' })).toBeVisible();
});

test('settings shortcuts', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.home();
  const animationMenu = await neo.navigation.openAnimationSettings();
  await expect(animationMenu.getByRole('menuitemcheckbox', { name: 'Toggle Animation' })).toBeChecked();
  await page.keyboard.press('Shift+N');
  await expect(animationMenu.getByRole('menuitemcheckbox', { name: 'Toggle Animation' })).not.toBeChecked();

  await animationMenu.getByRole('menuitem', { name: 'Speed' }).click();
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'Normal' })).toBeChecked();
  await page.keyboard.press('Shift+F');
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'Slow', exact: true })).toBeChecked();

  await animationMenu.getByRole('menuitem', { name: 'Mode' }).click();
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'All processes' })).toBeChecked();
  await page.keyboard.press('Shift+M');
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'Only current open process' })).toBeChecked();
  await page.keyboard.press('Escape');

  const themeMenu = await neo.navigation.openThemeSettings();
  await expect(themeMenu.getByRole('menuitemradio', { name: 'System' })).toBeChecked();
  await page.keyboard.press('Shift+T');
  await expect(themeMenu.getByRole('menuitemradio', { name: 'Light' })).toBeChecked();
});

test('simulation shortcuts', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.home();

  const browser = new Browser(page);
  await browser.expectClosed();
  await page.keyboard.press('Shift+S');
  await browser.expectOpen();
  await page.keyboard.press('Shift+S');
  await browser.expectClosed();

  await page.keyboard.press('Shift+R');
  await browser.expectOpenWidth('25.0');
  await page.keyboard.press('Shift+R');
  await browser.expectOpenWidth('40.0');
  await page.keyboard.press('Shift+R');
  await browser.expectOpenWidth('55.0');
  await page.keyboard.press('Shift+R');
  await browser.expectOpenWidth('70.0');
  await page.keyboard.press('Shift+R');
  await browser.expectClosed();
});

test('tab shortcuts', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overviewForm = await neo.forms();
  await overviewForm.card('EnterProduct').click();

  const overviewData = await neo.dataClasses();
  await overviewData.card('BusinessData').click();

  await neo.dataClasses();
  await overviewData.card('EntitySample').click();

  await expect(neo.controlBar.tabs()).toHaveCount(5);
  await neo.controlBar.tab('EntitySample').expectActive();
  await page.keyboard.press('Shift+Alt+W');
  await expect(neo.controlBar.tabs()).toHaveCount(4);
  await neo.controlBar.tab('BusinessData').expectActive();
  await page.keyboard.press('Shift+Alt+Q');
  await expect(neo.controlBar.tabs()).toHaveCount(0);
});

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
