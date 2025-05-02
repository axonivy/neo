import test, { expect } from '@playwright/test';
import { Browser } from '../page-objects/browser';
import { DataClassEditor } from '../page-objects/data-class-editor';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';
import { TEST_PROJECT } from './constants';

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
  await expect(dialog.locator('h2', { hasText: /^Create new Form$/ })).toBeVisible();

  await page.keyboard.press('Escape');

  await overview.card('EnterProduct').locator('.card').focus();
  await page.keyboard.press('Delete');
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('h2', { hasText: 'Are you sure you want to delete this form?' })).toBeVisible();
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
