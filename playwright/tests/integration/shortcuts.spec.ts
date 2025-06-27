import { expect, test } from '@playwright/test';
import { Browser } from '../page-objects/browser';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';
import { APP, TEST_PROJECT } from './constants';

test('navigate overviews and focus searchinput', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.home();
  await expect(page.locator('span', { hasText: /^Welcome to your workspace:/ })).toBeVisible();

  await page.keyboard.press('Alt+ControlOrMeta+P');
  await expect(page.locator('span', { hasText: /^Processes$/ })).toBeVisible();
  await expect(page.locator('input[placeholder="Search"]')).toBeFocused();

  await page.keyboard.press('Alt+ControlOrMeta+D');
  await expect(page.locator('span', { hasText: /^Data Classes$/ })).toBeVisible();
  await expect(page.locator('input[placeholder="Search"]')).toBeFocused();

  await page.keyboard.press('Alt+ControlOrMeta+F');
  await expect(page.locator('span', { hasText: /^Forms$/ })).toBeVisible();
  await expect(page.locator('input[placeholder="Search"]')).toBeFocused();

  await page.keyboard.press('Alt+ControlOrMeta+C');
  await expect(page.locator('span', { hasText: /^Configurations$/ })).toBeVisible();
  await expect(page.locator('input[placeholder="Search"]')).toBeFocused();

  await page.keyboard.press('Alt+ControlOrMeta+W');
  await expect(page.locator('span', { hasText: /^Welcome to your workspace:/ })).toBeVisible();
  await expect(page.locator('input[placeholder="Search"]')).toBeFocused();
});

test('focus nav and tabs and nav tabs with arrowkey', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.hasGroup(`Project: ${TEST_PROJECT}`);
  await overview.card('EnterProduct').click();
  await new FormEditor(neo, 'EnterProduct').expectOpen('Product');

  await page.keyboard.press('Alt+Shift+2');
  await expect(neo.navigation.navBar.getByRole('button').first()).toBeFocused();

  await page.keyboard.press('Alt+Shift+1');
  await new FormEditor(neo, 'EnterProduct').expectOpen('Product');

  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  await new DataClassEditor(neo, 'EnterProductData').expectOpen('data');
});

test('open add and delete dialog', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.hasGroup(`Project: ${TEST_PROJECT}`);
  await expect(page.locator('input[placeholder="Search"]')).toBeFocused();

  await page.keyboard.press('Tab');
  await page.keyboard.press('A');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const title = dialog.locator('h2', { hasText: /^Create new Form$/ });
  await expect(title).toBeVisible();
  await dialog.focus();
  await page.keyboard.press('Alt+ControlOrMeta+D');
  await expect(overview.title).toHaveText('Forms');

  await page.keyboard.press('Escape');

  await overview.card('EnterProduct').locator('.card').focus();
  await page.keyboard.press('Delete');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2', { hasText: 'Are you sure you want to delete this form?' })).toBeVisible();
});

test('open dialog inside editor deactivates shortcuts', async ({ page }) => {
  const neo = await Neo.openEditor(page, `dataclasses/${APP}/${TEST_PROJECT}/src_hd/neo/test/project/EnterProduct/EnterProductData`);
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
  await neo.home();

  await page.keyboard.press('M');
  await expect(page.locator('span', { hasText: /^Axon Ivy Market$/ })).toBeVisible();

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
  const menu = await neo.navigation.openSettings();
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Toggle Animation' })).toBeChecked();
  await page.keyboard.press('Shift+N');
  await expect(menu.getByRole('menuitemcheckbox', { name: 'Toggle Animation' })).not.toBeChecked();

  await menu.getByRole('menuitem', { name: 'Theme switch' }).click();
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'System' })).toBeChecked();
  await page.keyboard.press('Shift+T');
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'Light' })).toBeChecked();

  await menu.getByRole('menuitem', { name: 'Speed' }).click();
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'normal' })).toBeChecked();
  await page.keyboard.press('Shift+F');
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'slow', exact: true })).toBeChecked();

  await menu.getByRole('menuitem', { name: 'Mode' }).click();
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'All processes' })).toBeChecked();
  await page.keyboard.press('Shift+M');
  await expect(page.getByRole('menu').last().getByRole('menuitemradio', { name: 'Only current open process' })).toBeChecked();
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
  await overviewForm.hasGroup(`Project: ${TEST_PROJECT}`);
  await overviewForm.card('EnterProduct').click();

  const overviewData = await neo.dataClasses();
  await overviewData.hasGroup(`Project: ${TEST_PROJECT}`);
  await overviewData.card('BusinessData').click();

  await neo.dataClasses();
  await overviewData.hasGroup(`Project: ${TEST_PROJECT}`);
  await overviewData.card('EntitySample').click();

  await expect(neo.controlBar.tabs()).toHaveCount(5);
  await neo.controlBar.tab('EntitySample').expectActive();
  await page.keyboard.press('Shift+Alt+W');
  await expect(neo.controlBar.tabs()).toHaveCount(4);
  await neo.controlBar.tab('BusinessData').expectActive();
  await page.keyboard.press('Shift+Alt+Q');
  await expect(neo.controlBar.tabs()).toHaveCount(0);
});
