import { expect, test } from '@playwright/test';
import { ImportDialog } from '../page-objects/import-dialog';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';
import { workspace } from './constants';

test('navigate to home', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await neo.home();
  const infoOverview = new Overview(page, 0);
  const projectOverview = new Overview(page, 1);
  await expect(infoOverview.title).toHaveText(`Welcome to your application: ${workspace}`);
  await expect(projectOverview.title).toHaveText('Projects');
  await expect(infoOverview.infoCards).toHaveCount(4);
  await projectOverview.expectCardsCountGreaterThan(0);
});

test('click info cards', async ({ page }) => {
  await Neo.openWorkspace(page);
  const infoOverview = new Overview(page, 0);
  await infoOverview.clickInfoCard('Processes');
  await infoOverview.clickInfoCard('Data Classes');
  await infoOverview.clickInfoCard('Forms');
  await infoOverview.clickInfoCard('Configurations');
});

test('search projects', async ({ page }) => {
  await Neo.openWorkspace(page);
  const projectOverview = new Overview(page, 1);
  await projectOverview.search.fill('bla');
  await expect(projectOverview.cards).toHaveCount(0);
  await projectOverview.search.fill('test');
  await expect(projectOverview.cards).toHaveCount(1);
});

test('click market', async ({ page }) => {
  await Neo.openWorkspace(page);
  const projectOverview = new Overview(page, 1);
  const marketCard = projectOverview.newCard.getByText('Market');
  await marketCard.click();
  const marketOverview = new Overview(page);
  await expect(marketOverview.title).toHaveText('Axon Ivy Market');
});

test('click import', async ({ page }) => {
  await Neo.openWorkspace(page);
  const projectOverview = new Overview(page, 1);
  const importCard = projectOverview.newCard.getByText('File Import');
  await importCard.click();
  const dialog = new ImportDialog(page);
  await expect(dialog.title).toHaveText(`Import Axon Ivy Projects into: ${workspace}`);
});
