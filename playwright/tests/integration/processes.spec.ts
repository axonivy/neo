import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { ProcessEditor } from '../page-objects/process-editor';
import { TEST_PROJECT } from './constants';

test('navigate to process', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.hasGroup(`Project: ${TEST_PROJECT}`);
  await overview.hoverCard('jump', 'processes/jump');
  await overview.card('quickstart').click();
  await new ProcessEditor(neo, 'quickstart').expectOpen('1907DDB3CA766818-f0');
});

test('create process validations', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.checkCreateValidationMessage({ name: 'my process', nameError: "Invalid character ' ' at position 3 in 'my process'." });
  await overview.checkCreateValidationMessage({ name: 'switch', nameError: "Input 'switch' is a reserved keyword." });
  await overview.checkCreateValidationMessage({ name: 'JUMP', nameError: 'Artifact JUMP already exists.' });
  await overview.checkCreateValidationMessage({ name: 'JUMP', namespace: 'makeItValid' });
  await overview.checkCreateValidationMessage({ name: '', nameError: 'Artifact name must not be empty.' });
  await overview.checkCreateValidationMessage({ name: 'lowercase', nameWarning: "It's recommended to capitalize the first letter." });
  await overview.checkCreateValidationMessage({ name: 'EmptyNamespaceCheck', namespace: '' });
  await overview.checkCreateValidationMessage({ namespace: 'wrong.one', namespaceError: "Invalid character '.' at position 6 in 'wrong.one'." });
});

test('create and delete process', async ({ page, browserName }, testInfo) => {
  const processName = `${browserName}ws${testInfo.retry}`;
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.create(processName);
  await new ProcessEditor(neo, processName).expectOpen();
  await page.goBack();
  await overview.deleteCard(processName);
});

test('search processes', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill('quick');
  await expect(overview.cards).toHaveCount(1);
  await page.reload();
  expect(page.url()).toContain(`?group=${TEST_PROJECT}&search=quick`);
  await expect(overview.cards).toHaveCount(1);
});

test('process tags', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.processes();
  await overview.hasCardWithTag('subproc', 'Callable Subprocess');
  await overview.hasCardWithTag('wsprocess', 'Web Service');
  await overview.hasCardWithTag('quickstart');
});
