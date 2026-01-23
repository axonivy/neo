import { expect, test } from '@playwright/test';
import { CmsEditor } from '../../page-objects/cms-editor';
import { Neo } from '../../page-objects/neo';
import { Overview } from '../../page-objects/overview';
import { VariableEditor } from '../../page-objects/variables-editor';
import { TEST_PROJECT } from '../constants';

test('navigate to configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await overview.card('variables').click();
  await new VariableEditor(neo, 'variables').expectOpen('MyVar');
  await neo.configs();
  await overview.card('cms').click();
  await new CmsEditor(neo, 'cms').expectOpen('/Labels/ReleaseDate');
});

test('search configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await expect(overview.cards).toHaveCount(5);
  await overview.search.fill('bla');
  await expect(overview.cards).toHaveCount(0);
  await expect(page.locator(`text=No artifacts were found.`)).toBeVisible();
  await overview.search.fill('cms');
  await expect(overview.cards).toHaveCount(1);
  await expect(page.locator(`text=No artifacts were found.`)).toBeHidden();
});

test('sort configs', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const overview = await neo.configs();
  await overview.clickSortByAtoZ();
  await expect(overview.cards.first()).toContainText('cms');
  await overview.clickSortByZtoA();
  await expect(overview.cards.first()).toContainText('variables');
});

test('filter configs', async ({ page }) => {
  await Neo.openWorkspace(page, 'configurations?p=not-existing');
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
