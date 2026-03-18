import { expect, type Page, test } from '@playwright/test';
import { randomInt } from 'node:crypto';
import { CaseMapEditor } from '../../page-objects/case-map-editor';
import { Neo } from '../../page-objects/neo';
import { APP, TEST_PROJECT } from '../constants';

const openCaseMap = async (page: Page) => {
  const neo = await Neo.openWorkspace(page, `processes/${APP}/${TEST_PROJECT}/processes/Lending.icm`);
  const editor = new CaseMapEditor(neo, 'Lending.icm');
  await editor.expectOpen('Identification');
  return { neo, editor };
};

test('restore editor', async ({ page }) => {
  await openCaseMap(page);
});

test.describe('inscription', () => {
  test('change value', async ({ page }) => {
    const { editor } = await openCaseMap(page);
    const stage = editor.stageByName('Identification');
    const inscription = await stage.openInscription();
    const name = inscription.inscription.getByLabel('Name', { exact: true });
    await name.fill('changed');
    const stageChanged = editor.stageByName('changed');
    await expect(stageChanged.stage).toContainText('changed');
    await name.fill('Identification');
    await expect(stage.stage).not.toContainText('changed');
  });

  test('open help', async ({ page, context }) => {
    const { editor } = await openCaseMap(page);
    const inscription = await editor.stageByName('Identification').openInscription();
    const pagePromise = context.waitForEvent('page');
    await inscription.inscription.getByRole('button', { name: /Help/ }).click();
    const newPage = await pagePromise;
    await expect(newPage).toHaveURL(/designer-guide\/process-modeling\/casemap.html/);
  });
});

test('create case map validations', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.checkCreateValidationMessage({ name: 'my process', nameError: "Invalid character ' ' at position 3 in 'my process'.", type: 'Case Maps' });
  await overview.checkCreateValidationMessage({ name: 'switch', nameError: "Input 'switch' is a reserved keyword.", type: 'Case Maps' });
  await overview.checkCreateValidationMessage({ name: 'Lending (Case Map)', nameError: 'Artifact Lending (Case Map) already exists.', type: 'Case Maps' });
  await overview.checkCreateValidationMessage({ name: '', nameError: 'Artifact name must not be empty.', type: 'Case Maps' });
  await overview.checkCreateValidationMessage({ name: 'lowercase', nameWarning: "It's recommended to capitalize the first letter.", type: 'Case Maps' });
  await overview.checkCreateValidationMessage({ name: 'EmptyNamespaceCheck', namespace: '', namespaceError: 'Artifact namespace must not be empty.', type: 'Case Maps' });
  await overview.checkCreateValidationMessage({ namespace: 'wrong/one', namespaceError: "Invalid character '/' at position 6 in 'wrong/one'.", type: 'Case Maps' });
});

test('create and delete case map', async ({ page, browserName }) => {
  const casemapName = `${browserName} ${randomInt(10000)}`;
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.create(casemapName.replace(/\s+/g, ''), undefined, { type: 'Case Maps' });
  await new CaseMapEditor(neo, casemapName).expectOpen();
  await page.goBack();
  await overview.deleteCard(casemapName);
});

test('filter case map', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await expect(overview.cards).toHaveCount(7);
  await overview.filter.filterProject('Case Map');
  await expect(overview.filter.badge).toHaveText('1');
  await expect(overview.cards).toHaveCount(1);
});
