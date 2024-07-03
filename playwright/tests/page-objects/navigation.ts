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
    await expect(this.page.getByRole('menu')).toHaveAttribute('data-state', 'open');
  }
}
