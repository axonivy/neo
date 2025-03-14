import test, { expect } from '@playwright/test';
import { Neo } from '../page-objects/neo';

test('switch language to german', async ({ page }) => {
  const neo = await Neo.openWorkspace(page);
  await expect(neo.page.getByText('Welcome to your workspace: neo-test-project')).toBeVisible();
  const settings = await neo.navigation.openSettings();
  const langSettings = settings.getByRole('menuitem').filter({ hasText: 'Language' }).first();
  await langSettings.click();
  await settings.getByRole('menuitemradio').filter({ hasText: 'de' }).first().click();
  await expect(neo.page.getByText('Willkommen in Ihrem Arbeitsbereich: neo-test-project')).toBeVisible();
});
