import { expect, test } from '@playwright/test';
import { Neo } from '../page-objects/neo';
import { Overview } from '../page-objects/overview';

const workspace = process.env.WORKSPACE ?? 'designer';

test('navigate to workspace', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  await expect(overview.title).toHaveText('Welcome to Axon Ivy NEO Designer');
  await overview.expectCardsCountGreaterThan(0);
  await overview.card(workspace).click();
  await expect(page.locator(`text=Welcome to your workspace: ${workspace}`)).toBeVisible();
});

test('create and delete workspace', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  await overview.create('newws');
  await expect(page.locator('text=Welcome to your workspace: newws')).toBeVisible();

  await page.goBack();
  await expect(overview.card('newws')).toBeVisible();
  await overview.deleteCard('newws', true);
  await expect(overview.card('newws')).toBeHidden();
});

test('search workspaces', async ({ page }) => {
  await Neo.open(page);
  const overview = new Overview(page);
  await overview.expectCardsCountGreaterThan(0);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);

  await overview.search.fill(workspace);
  await expect(overview.cards).toHaveCount(1);
});
