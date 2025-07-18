import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { rmWorkspaceExportDir, WORKSPACE, workspaceExportZip } from './constants';

test('navigate to workspace', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  await expect(page.getByText('Welcome to Axon Ivy NEO Designer')).toBeVisible();
  await overview.expectCardsCountGreaterThan(0);
  await overview.card(WORKSPACE).click();
  await expect(page.locator(`text=Welcome to your workspace: ${WORKSPACE}`)).toBeVisible();
});

test('create workspace validations', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  await overview.checkCreateValidationMessage({ name: 'my workspace', nameError: "Invalid character ' ' at position 3 in 'my workspace'." });
  await overview.checkCreateValidationMessage({ name: 'switch', nameError: "Input 'switch' is a reserved keyword." });
  await overview.checkCreateValidationMessage({ name: 'NEO-test-PROJECT', nameError: 'Artifact NEO-test-PROJECT already exists.' });
  await overview.checkCreateValidationMessage({ name: '', nameError: 'Artifact name must not be empty.' });
  await overview.checkCreateValidationMessage({ name: 'lowercase', nameWarning: "It's recommended to capitalize the first letter." });
});

test('create with keyboard and delete workspace', async ({ page, browserName }, testInfo) => {
  const wsName = `${browserName}ws${testInfo.retry}`;
  await Neo.open(page);
  const overview = new Overview(page);
  await overview.create(wsName, undefined, { useKeyToCreate: true });
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await page.goBack();
  await overview.deleteCard(wsName, true);
});

test('create and delete workspace', async ({ page, browserName }, testInfo) => {
  const wsName = `${browserName}ws${testInfo.retry}`;
  await Neo.open(page);
  const overview = new Overview(page);
  await overview.create(wsName);
  await expect(page.locator(`text=Welcome to your workspace: ${wsName}`)).toBeVisible();
  await page.goBack();
  await overview.deleteCard(wsName, true);
});

test('search workspaces', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  await overview.expectCardsCountGreaterThan(0);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await overview.search.fill(WORKSPACE);
  await expect(overview.cards).toHaveCount(1);
});

test('deploy workspaces', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  const card = overview.card(WORKSPACE);
  await overview.clickCardAction(card, 'Deploy');
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('button', { name: 'Deploy' }).click();
  await expect(dialog.locator('code')).toContainText("Info: Project(s) of file 'export.zip' successful deployed to application 'myApp'");
  await dialog.getByRole('button', { name: 'Close' }).click();
});

test.describe('export', () => {
  test.afterAll(() => {
    rmWorkspaceExportDir();
  });

  test('export', async ({ page }) => {
    const zipFile = workspaceExportZip('simpleExport.zip');
    await Neo.exportWorkspace(page, zipFile);
  });
});
