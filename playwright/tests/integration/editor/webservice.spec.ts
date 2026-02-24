import { expect, type Page, test } from '@playwright/test';
import { Neo } from '../../page-objects/neo';
import { WebserviceEditor } from '../../page-objects/webservice-editor';
import { APP, TEST_PROJECT } from '../constants';

const openWebserviceClients = async (page: Page) => {
  const neo = await Neo.openWorkspace(page, `configurations/${APP}/${TEST_PROJECT}/config/webservice-clients.yaml`);
  const editor = new WebserviceEditor(neo, 'webservice-clients');
  await editor.expectOpen('interceptedService');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openWebserviceClients(page);
});

test.describe('inscription', () => {
  test('change value', async ({ page }) => {
    const { editor } = await openWebserviceClients(page);
    const client = editor.rowByName('interceptedService');
    await expect(client.row).toContainText('{ivy.app.baseurl}/ws/connectivity-demos/16D29AE50A7A6E34');
    const inscription = await client.openInscription();
    const fullName = inscription.inscription.getByLabel('URI', { exact: true });
    await fullName.fill('changed');
    await expect(client.row).toContainText('changed');
    await fullName.fill('{ivy.app.baseurl}/ws/connectivity-demos/16D29AE50A7A6E34');
    await expect(client.row).not.toContainText('changed');
    await expect(client.row).toContainText('{ivy.app.baseurl}/ws/connectivity-demos/16D29AE50A7A6E34');
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openWebserviceClients(page);
    const inscription = await editor.rowByName('interceptedService').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/developer.axonivy.com/);
    await expect(newPage).toHaveURL(/webservice-clients.html/);
  });
});
