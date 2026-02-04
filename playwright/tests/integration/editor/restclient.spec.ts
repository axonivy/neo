import { expect, type Page, test } from '@playwright/test';
import { Neo } from '../../page-objects/neo';
import { RestClientEditor } from '../../page-objects/restclient-editor';
import { APP, TEST_PROJECT } from '../constants';

const openRestClients = async (page: Page) => {
  const neo = await Neo.openWorkspace(page, `configurations/${APP}/${TEST_PROJECT}/config/rest-clients.yaml`);
  const editor = new RestClientEditor(neo, 'rest-clients');
  await editor.expectOpen('personService');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openRestClients(page);
});

test.describe('inscription', () => {
  test('change value', async ({ page }) => {
    const { editor } = await openRestClients(page);
    const restClient = editor.rowByName('personService');
    await expect(restClient.row).toContainText('{ivy.app.baseurl}/api/persons');
    const inscription = await restClient.openInscription();
    const fullName = inscription.inscription.getByLabel('URI', { exact: true });
    await fullName.fill('changed');
    await expect(restClient.row).toContainText('changed');
    await fullName.fill('{ivy.app.baseurl}/api/persons');
    await expect(restClient.row).not.toContainText('changed');
    await expect(restClient.row).toContainText('{ivy.app.baseurl}/api/persons');
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openRestClients(page);
    const inscription = await editor.rowByName('personService').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/rest-clients.html/);
  });
});
