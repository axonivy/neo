import test, { expect } from '@playwright/test';
import { Neo } from '../page-objects/neo';

test('available lanugages', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  const settings = await neo.navigation.openLanguageSettings();
  const langOptions = settings.getByRole('menuitemradio');
  await expect(langOptions.filter({ hasText: 'en' }).first()).toBeVisible();
  await expect(langOptions.filter({ hasText: 'de' }).first()).toBeVisible();
});

test('switch language to german', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await expect(neo.page.getByText('Welcome to your workspace: neo-test-project')).toBeVisible();
  await neo.navigation.changeLanguage('Deutsch');
  await expect(neo.page.getByText('Willkommen in Ihrem Arbeitsbereich: neo-test-project')).toBeVisible();
});
