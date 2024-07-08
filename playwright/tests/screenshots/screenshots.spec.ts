import { expect, Page, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { ProcessEditor } from '../page-objects/process-editor';
import { VariableEditor } from '../page-objects/variables-editor';

test.describe('screenshots', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
  });

  test('home', async ({ page }) => {
    await Neo.open(page);
    const overview = new Overview(page);
    await expect(overview.title).toHaveText(/Welcome/);
    await overview.waitForHiddenSpinner();
    await screenshot(page, 'home.png');
  });

  test('processes', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    await neo.processes();
    await screenshot(page, 'processes.png');
  });

  test('process editor', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    const overview = await neo.processes();
    await overview.card('quickstart').click();
    await neo.controlBar.tab('quickstart').expectActive();
    await new ProcessEditor(page, 'quickstart').waitForOpen('1907DDB3CA766818-f0');
    await screenshot(page, 'process-editor.png');
  });

  test('forms', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    await neo.forms();
    await screenshot(page, 'forms.png');
  });

  test('form editor', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    const overview = await neo.forms();
    await overview.card('EnterProduct').click();
    await neo.controlBar.tab('EnterProduct').expectActive();
    await new FormEditor(page, 'EnterProduct').waitForOpen('Product');
    await screenshot(page, 'form-editor.png');
  });

  test('configs', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    await neo.configs();
    await screenshot(page, 'configs.png');
  });

  test.skip('variable editor', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    const overview = await neo.configs();
    await overview.card(/neo-test-project/).click();
    await neo.controlBar.tab('variables').expectActive();
    await new VariableEditor(page, 'variables').waitForOpen('MyVar');
    await screenshot(page, 'variable-editor.png');
  });

  test('browser', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    await neo.browser();
    await screenshot(page, 'browser.png');
  });

  test('settings', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    await neo.navigation.openSettings();
    await screenshot(page, 'settings.png', { width: 500, height: 300 });
  });
});

async function screenshot(page: Page, name: string, size?: { width?: number; height?: number }) {
  await page.setViewportSize({ width: size?.width ?? 900, height: size?.height ?? 550 });
  const dir = process.env.SCREENSHOT_DIR ?? './target';
  const buffer = await page.screenshot({ path: `${dir}/screenshots/${name}`, animations: 'disabled' });
  expect(buffer.byteLength).toBeGreaterThan(3000);
}
