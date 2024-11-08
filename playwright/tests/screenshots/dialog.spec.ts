import { expect, test, type Page } from '@playwright/test';
import { TEST_PROJECT, WORKSPACE } from '../integration/constants';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { screenshotElement } from './screenshot-util';

test.describe('workspace', () => {
  test('new', async ({ page }) => {
    await Neo.open(page);
    const workspaces = new Overview(page);
    await workspaces.newCard.click();
    await screenshotDialog(page, 'dialog-new-workspace');
  });

  test('deploy', async ({ page }) => {
    await Neo.open(page);
    const workspaces = new Overview(page);
    const card = workspaces.card(WORKSPACE);
    await workspaces.clickCardAction(card, 'Deploy');
    await screenshotDialog(page, 'dialog-deploy-workspace');
  });
});

test.describe('project', () => {
  test('import from file', async ({ page }) => {
    await Neo.openWorkspace(page);
    const projects = new Overview(page);
    await projects.clickCardAction(projects.newCard, 'Import from File');
    await screenshotDialog(page, 'dialog-import-from-file');
  });

  test('import from market', async ({ page }) => {
    await Neo.openWorkspace(page);
    const projects = new Overview(page);
    await projects.clickCardAction(projects.newCard, 'Import from Market');
    const market = new Overview(page);
    await market.card('Axon Ivy Portal').click();
    await screenshotDialog(page, 'dialog-import-from-market');
  });

  test('new dependency', async ({ page }) => {
    await Neo.openWorkspace(page);
    const projects = new Overview(page);
    await projects.card(TEST_PROJECT).click();
    const dependencies = new Overview(page);
    await dependencies.newCard.click();
    await screenshotDialog(page, 'dialog-new-dependency');
  });
});

test.describe('new aritfact', async () => {
  test('process', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    const processes = await neo.processes();
    await processes.newCard.click();
    await screenshotDialog(page, 'dialog-new-process');
  });

  test('form', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    const forms = await neo.forms();
    await forms.newCard.click();
    await screenshotDialog(page, 'dialog-new-form');
  });

  test('data class', async ({ page }) => {
    const neo = await Neo.openWorkspace(page);
    const dataclasses = await neo.dataClasses();
    await dataclasses.newCard.click();
    await screenshotDialog(page, 'dialog-new-data-class');
  });
});

const screenshotDialog = async (page: Page, name: string) => {
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await screenshotElement(dialog, name);
};
