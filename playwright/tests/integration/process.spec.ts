import { expect, Page, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { ProcessEditor, ProcessEditorElement } from '../page-objects/process-editor';

const app = process.env.WORKSPACE ? 'ivy-dev-test-ws' : 'designer';

const openQuickStartProcess = async (page: Page) => {
  const neo = await Neo.openEditor(page, `processes/${app}/neo-test-project/quickstart`);
  const editor = new ProcessEditor(neo, 'quickstart');
  await editor.waitForOpen('1907DDB3CA766818-f0');
  return { neo, editor };
};

const openJumpProcess = async (page: Page) => {
  const neo = await Neo.openEditor(page, `processes/${app}/neo-test-project/jump`);
  const editor = new ProcessEditor(neo, 'jump');
  await editor.waitForOpen('1907DD66AA11FCD9-f0');
  return { neo, editor };
};

const openSubProcess = async (page: Page) => {
  const neo = await Neo.openEditor(page, `processes/${app}/neo-test-project/subproc`);
  const editor = new ProcessEditor(neo, 'subproc');
  await editor.waitForOpen('1907DD74AA37CDB2-f0');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openQuickStartProcess(page);
});

test('switch theme', async ({ page }) => {
  const { neo, editor } = await openSubProcess(page);
  const element = editor.elementByPid('1907DD74AA37CDB2-f3');
  const inscription = await element.openInscription();
  await inscription.openAccordion('Output');
  await inscription.openSection('Code');
  const monacoTheme = inscription.inscription.locator('.monaco-editor');
  const editorTheme = editor.frame.locator('html');

  await expect(editorTheme).toHaveClass('light');
  await expect(editorTheme).toHaveAttribute('data-theme', 'light');
  await expect(monacoTheme).toHaveClass(/vs/);
  await expect(monacoTheme).not.toHaveClass(/vs-dark/);

  await neo.navigation.changeTheme('dark');
  await expect(editorTheme).toHaveClass('dark');
  await expect(editorTheme).toHaveAttribute('data-theme', 'dark');
  await expect(monacoTheme).toHaveClass(/vs-dark/);
});

test('start process', async ({ page, browserName }) => {
  test.skip(browserName === 'webkit', 'webkit shows a ViewExpiredException instead of the form dialog');
  const { neo, editor } = await openQuickStartProcess(page);
  await editor.waitForOpen('1907DDB3CA766818-f0');
  const element = editor.elementByPid('1907DDB3CA766818-f0');
  await element.triggerQuickAction(/Start Process/);
  await element.expectExecuted();
  const browser = await neo.browser();
  await browser.expectOpen();
  await expect(browser.browserView.locator('#iFrameForm\\:frameTaskName')).toHaveText('Enter Product Task');
});

test.describe('jump to process', () => {
  test('sub', async ({ page }) => {
    const { neo, editor } = await openJumpProcess(page);
    const element = editor.elementByPid('1907DD66AA11FCD9-f6');
    await element.triggerQuickAction(/Jump/);
    await new ProcessEditor(neo, 'subproc').waitForOpen('1907DD74AA37CDB2-f0');
  });

  test('hd', async ({ page }) => {
    const { neo, editor } = await openJumpProcess(page);
    const element = editor.elementByPid('1907DD66AA11FCD9-f5');
    await element.triggerQuickAction(/Jump/);
    await new ProcessEditor(neo, 'EnterProductProcess').waitForOpen('1907DDC2CCF1790F-f0');
  });

  test('trigger', async ({ page }) => {
    const { neo, editor } = await openJumpProcess(page);
    const element = editor.elementByPid('1907DD66AA11FCD9-f3');
    await element.triggerQuickAction(/Jump/);
    await new ProcessEditor(neo, 'quickstart').waitForOpen('1907DDB3CA766818-f0');
  });

  test('embedded', async ({ page }) => {
    const { editor } = await openJumpProcess(page);
    const element = editor.elementByPid('1907DD66AA11FCD9-S10');
    const subElement = editor.elementByPid('1907DD66AA11FCD9-S10-g0');
    await expect(subElement.element).toBeHidden();
    await element.triggerQuickAction(/Jump/);
    await expect(subElement.element).toBeVisible();
  });
});

test.describe('inscription', () => {
  test('Change User Dialog display name', async ({ page }) => {
    const { editor } = await openSubProcess(page);
    const element = editor.elementByPid('1907DD74AA37CDB2-f3');
    const inscription = await element.openInscription();
    await inscription.openAccordion('General');
    await inscription.openSection('Name / Description');
    const nameInput = inscription.inscription.getByLabel('Display Name');
    await nameInput.fill('script');
    await expect(element.element).toHaveText('script');
    await nameInput.clear();
    await expect(element.element).toHaveText('');
  });

  test('create hd', async ({ page }) => {
    const { editor } = await openJumpProcess(page);
    const element = editor.elementByPid('1907DD66AA11FCD9-f5');
    await assertCreateNewAction(page, element, 'Dialog', 'Dialog', 'Create new Html Dialog', 'Create new Form');
  });

  test('create sub', async ({ page }) => {
    const { editor } = await openJumpProcess(page);
    const element = editor.elementByPid('1907DD66AA11FCD9-f6');
    await assertCreateNewAction(page, element, 'Process', 'Process start', 'Create new Sub Process', 'Create new Process');
  });

  test('create trigger', async ({ page }) => {
    const { editor } = await openJumpProcess(page);
    const element = editor.elementByPid('1907DD66AA11FCD9-f3');
    await assertCreateNewAction(page, element, 'Process', 'Process start', 'Create new Trigger Process', 'Create new Process');
  });

  const assertCreateNewAction = async (page: Page, element: ProcessEditorElement, accordion: string, section: string, newButton: string, dialogTitle: string) => {
    const inscription = await element.openInscription();
    await inscription.openAccordion(accordion);
    await inscription.openSection(section);
    await inscription.inscription.getByRole('button', { name: newButton }).click();
    await expect(page.getByRole('dialog').locator(`.ui-dialog-title:has-text("${dialogTitle}")`)).toBeVisible();
  };

  test('code block', async ({ page }) => {
    const { editor } = await openSubProcess(page);
    const element = editor.elementByPid('1907DD74AA37CDB2-f3');
    const inscription = await element.openInscription();
    await inscription.openAccordion('Output');
    await inscription.openSection('Code');

    const monacoEditor = inscription.monacoEditor();
    await expect(monacoEditor).toBeVisible();
    await monacoEditor.click();
    await inscription.triggerMonacoContentAssist();
    await expect(monacoEditor).toHaveText('');
    await inscription.triggerMonacoCompletion('ivy');
    await page.keyboard.type('.l');
    await inscription.triggerMonacoCompletion('log');
    await page.keyboard.type('.de');
    await inscription.triggerMonacoCompletion('debug(Object message)');
    await expect(monacoEditor).toHaveText('ivy.log.debug(message)');
    await clearAll(page);
    await expect(monacoEditor).toHaveText('');
  });
});

const clearAll = async (page: Page) => {
  if (page.context().browser()?.browserType().name() === 'webkit') {
    await page.keyboard.press('Meta+KeyA');
  } else {
    await page.keyboard.press('Control+KeyA');
  }
  await page.keyboard.press('Delete');
};
