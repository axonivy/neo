import { expect, test } from '@playwright/test';
import { FormEditor } from '../page-objects/form-editor';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { TEST_PROJECT } from './constants';

test('navigate to forms', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.card('EnterProduct').click();
  await new FormEditor(neo, 'EnterProduct').expectOpen('Product');
});

test('create form validations', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.checkCreateValidationMessage({ name: 'my artifact', nameError: "Invalid character ' ' at position 3 in 'my artifact'." });
  await overview.checkCreateValidationMessage({ name: 'switch', nameError: "Input 'switch' is a reserved keyword." });
  await overview.checkCreateValidationMessage({ name: 'enterproduct', nameError: 'Artifact enterproduct already exists.' });
  await overview.checkCreateValidationMessage({ name: 'enterproduct', namespace: 'makeItValid' });
  await overview.checkCreateValidationMessage({ name: '', nameError: 'Artifact name must not be empty.' });
  await overview.checkCreateValidationMessage({ name: 'lowercase', nameWarning: "It's recommended to capitalize the first letter." });
  await overview.checkCreateValidationMessage({ namespace: '', namespaceError: 'Artifact namespace must not be empty.' });
  await overview.checkCreateValidationMessage({ namespace: 'wrong/one', namespaceError: "Invalid character '/' at position 6 in 'wrong/one'." });
});

test('create and delete form', async ({ page, browserName }, testInfo) => {
  const fromName = `${browserName}ws${testInfo.retry}`;
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.create(fromName, 'test', { hasDataClassSelect: true });
  await new FormEditor(neo, fromName).expectOpen();
  await page.goBack();
  await overview.deleteCard(fromName);
});

test('search forms', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.forms();
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('Enter');
  await expect(overview.cards).toHaveCount(1);
});

test('filter forms', async ({ page }) => {
  await Neo.openWorkspace(page, 'forms?p=not-existing');
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
