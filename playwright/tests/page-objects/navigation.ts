import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { OverviewTypes } from './neo';

export class Navigation {
  protected readonly page: Page;
  protected readonly navBar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navBar = page.getByRole('navigation');
  }

  async open(overview: OverviewTypes) {
    const navLink = this.navBar.getByRole('link', { name: overview });
    await navLink.click();
    await expect(navLink).toHaveClass(/active/);
  }

  async openSettings() {
    const settings = this.navBar.getByRole('button', { name: 'Settings' });
    await expect(settings).toHaveAttribute('data-state', 'closed');
    await settings.click();
    const settingsMenu = this.page.getByRole('menu');
    await expect(settingsMenu).toHaveAttribute('data-state', 'open');
    return settingsMenu;
  }

  async changeTheme(theme: 'light' | 'dark') {
    const menu = await this.openSettings();
    const themeSwitch = menu.getByRole('menuitem', { name: 'Theme switch' });
    await expect(themeSwitch).toBeVisible();
    if ((await themeSwitch.getAttribute('data-state')) !== theme) {
      await themeSwitch.click();
    }
  }

  async enableAnimation() {
    const menu = await this.openSettings();
    const animationSwitch = menu.getByRole('menuitemcheckbox', { name: 'Toggle animation' });
    await expect(animationSwitch).toBeVisible();
    if ((await animationSwitch.getAttribute('data-state')) !== 'checked') {
      await animationSwitch.click();
    }
  }

  async changeAnimationSpeed(speed: '0' | '25' | '50' | '75' | '100') {
    const menu = await this.openSettings();
    const speedTrigger = menu.getByRole('menuitem', { name: 'Speed' });
    await speedTrigger.click();
    await this.page.getByRole('menu').last().getByRole('menuitemradio', { name: speed, exact: true }).click();
  }
}
