import { expect, type Page, test } from '@playwright/test';
import { randomInt } from 'crypto';
import { DataClassEditor } from '../../page-objects/data-class-editor';
import { Neo } from '../../page-objects/neo';
import { Overview } from '../../page-objects/overview';
import { TEST_PROJECT } from '../constants';

const openDataClasses = async (page: Page) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  return { neo, overview };
};

test('navigate to data classes', async ({ page }) => {
  const { neo, overview } = await openDataClasses(page);
  const dataClassName = 'QuickStartTutorial';
  await overview.card(dataClassName).click();
  await new DataClassEditor(neo, dataClassName).expectOpen('releaseDate');
});

test('create data class validations', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  await overview.checkCreateValidationMessage({ name: 'my artifact', nameError: "Invalid character ' ' at position 3 in 'my artifact'." });
  await overview.checkCreateValidationMessage({ name: 'switch', nameError: "Input 'switch' is a reserved keyword." });
  await overview.checkCreateValidationMessage({ name: 'data', nameError: 'Artifact data already exists.' });
  await overview.checkCreateValidationMessage({ name: 'data', namespace: 'makeItValid' });
  await overview.checkCreateValidationMessage({ name: '', nameError: 'Artifact name must not be empty.' });
  await overview.checkCreateValidationMessage({ name: 'lowercase', nameWarning: "It's recommended to capitalize the first letter." });
  await overview.checkCreateValidationMessage({ namespace: '', namespaceError: 'Artifact namespace must not be empty.' });
  await overview.checkCreateValidationMessage({ namespace: 'wrong/one', namespaceError: "Invalid character '/' at position 6 in 'wrong/one'." });
});

test('create and delete data class', async ({ page }) => {
  const { neo, overview } = await openDataClasses(page);
  const dataClassName = `dc${randomInt(10000)}`;
  await overview.create(dataClassName, 'temp', { project: TEST_PROJECT });
  await new DataClassEditor(neo, dataClassName).expectOpen();
  await neo.page.goBack();
  await overview.deleteCard(dataClassName);
  await expect(overview.card(dataClassName)).toBeHidden();
});

test('search data classes', async ({ page }) => {
  const { overview } = await openDataClasses(page);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('quick');
  await expect(overview.cards).toHaveCount(1);
});

test('sort data classes', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.dataClasses();
  await overview.clickSortByAtoZ();
  await expect(overview.cards.first()).toContainText('Address');
  await overview.clickSortByZtoA();
  await expect(overview.cards.first()).toContainText('wsprocessData');
});

test('filter data classes', async ({ page }) => {
  await Neo.openWorkspace(page, 'dataclasses?p=not-existing');
  const overview = new Overview(page);
  await expect(overview.filter.filterTag('not-existing')).toBeVisible();
  await expect(overview.filter.badge).toHaveText('1');
  await expect(overview.cards).toHaveCount(0);

  await overview.filter.filterProject(TEST_PROJECT);
  await expect(overview.filter.badge).toHaveText('2');
  await expect(overview.cards).not.toHaveCount(0);

  await overview.filter.filterTag('not-existing').getByRole('button').click();
  await expect(overview.filter.filterTag('not-existing')).toBeHidden();
  await expect(overview.filter.badge).toHaveText('1');
  await expect(overview.cards).not.toHaveCount(0);

  await page.reload();
  expect(page.url()).toContain(`?p=${TEST_PROJECT}`);
  await overview.filter.resetFilter();
  await expect(overview.cards).not.toHaveCount(0);
});

test('data class tags', async ({ page }) => {
  const { overview } = await openDataClasses(page);
  await overview.hasCardWithTag('subprocData');
  await overview.hasCardWithTag('BusinessData', 'Business Data');
  await overview.hasCardWithTag('EntitySample', 'Entity');
});

test('data classes graph', async ({ page }) => {
  const { neo, overview } = await openDataClasses(page);
  await overview.viewToggle.getByRole('radio', { name: 'Graph View' }).click();

  const graph = overview.graph;
  await graph.fitViewButton.click();
  await expect(graph.edges).toHaveCount(2);

  const quickStartNode = graph.getNodeByText('Person');
  await quickStartNode.expandNode.click();
  await expect(quickStartNode.node).toContainText('Personneo.test.project.Personname:Stringage:Number');

  await quickStartNode.jumpInto.click();
  await new DataClassEditor(neo, 'Person').expectOpen('age');
});

test('database import wizard', async ({ page }) => {
  const { neo, overview } = await openDataClasses(page);
  const importButton = overview.importButton;
  await expect(importButton).toBeVisible();
  await importButton.click();
  const importDialog = neo.page.locator('.database-editor-import-dialog');
  await expect(importDialog).toBeVisible();
});
