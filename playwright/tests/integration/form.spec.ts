import { expect, type Page, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';
import { APP, TEST_PROJECT } from './constants';

const openForm = async (page: Page) => {
  const neo = await Neo.openEditor(page, `forms/${APP}/${TEST_PROJECT}/src_hd/neo/test/project/EnterProduct/EnterProduct`);
  const editor = new FormEditor(neo, 'EnterProduct');
  await editor.expectOpen('Product');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openForm(page);
});

test.describe('jump to editor', () => {
  test('jump to data class', async ({ page }) => {
    const { neo, editor } = await openForm(page);
    await editor.canvas.getByRole('button', { name: 'Open Data Class' }).click();
    await neo.controlBar.tab('EnterProductData').expectActive();
  });

  test('jump to process', async ({ page }) => {
    const { neo, editor } = await openForm(page);
    await editor.canvas.getByRole('button', { name: 'Open Process' }).click();
    await neo.controlBar.tab('EnterProductProcess').expectActive();
  });
});

test.describe('inscription', () => {
  test('change value', async ({ page }) => {
    const { editor } = await openForm(page);
    const block = editor.blockByName('Product');
    const inscription = await block.openInscription();
    const valueInput = inscription.badgedInput('Value');
    await valueInput.fill('Table');
    await valueInput.expectBadgeValue('Table');
    await block.expectInputValue('Table');

    await valueInput.fill('#{data.data.product}');
    await valueInput.expectBadgeValue('data.product');
    await block.expectInputValue('data.product');
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openForm(page);
    const inscription = await editor.blockByName('Product').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/form-editor.html/);
  });
});

test.describe('preview', () => {
  test('open preview', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'webkit shows a ViewExpiredException');
    const { neo, editor } = await openForm(page);
    await editor.editor.getByRole('button', { name: 'Open Preview' }).click();
    const browser = await neo.browser();
    await expect(browser.browserView.locator('#iFrameForm\\:frameTaskName')).toHaveText('Preview');
  });

  test('navigate jsf', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'webkit shows a ViewExpiredException');
    const neo = await navigate(page, 'userdialog/jsf.ivp', 'JSF Dialog');
    await neo.toast.expectError('Unknown editor type');
  });

  test('navigate form', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'webkit shows a ViewExpiredException');
    const neo = await navigate(page, 'userdialog/form.ivp', 'Form Dialog');
    const editor = new FormEditor(neo, 'EnterProduct');
    await editor.expectOpen();
    await editor.blockByName('Product').expectSelected();
  });

  const navigate = async (page: Page, process: string, expectedTaskName: string) => {
    const neo = await Neo.openWorkspace(page);
    await neo.navigation.disableAnimation();
    const browser = await neo.browser();
    await browser.startProcess(process);
    await expect(browser.browserView.locator('#iFrameForm\\:frameTaskName')).toHaveText(expectedTaskName);
    const frame = browser.browserView.frameLocator('iframe');
    const label = frame.getByLabel('Product');
    await expect(label).toBeVisible();

    const overlay = frame.locator('#selectionOverlay');
    await expect(overlay).toBeHidden();
    await browser.browserView.locator('#iFrameForm\\:previewElementPicker').click();
    await expect(overlay).toBeVisible();
    await label.click();
    await expect(overlay).toBeHidden();
    return neo;
  };
});
