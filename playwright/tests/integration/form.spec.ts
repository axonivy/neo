import { Page, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';

const app = process.env.WORKSPACE ? 'ivy-dev-test-ws' : 'designer';

const openForm = async (page: Page) => {
  const neo = await Neo.openEditor(page, `forms/${app}/neo-test-project/neo/test/project/EnterProduct/EnterProduct`);
  const editor = new FormEditor(neo, 'EnterProduct');
  await editor.waitForOpen('Product');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openForm(page);
});

test.describe('inscription', () => {
  test('Change value', async ({ page }) => {
    const { editor } = await openForm(page);
    const block = editor.blockByName('Product');
    const inscription = await block.openInscription();
    const valueInput = inscription.inscription.getByLabel('value');
    await valueInput.fill('Table');
    await block.expectInputValue('Table');
    await valueInput.fill('#{data.data.product}');
    await block.expectInputValue('#{data.data.product}');
  });
});
