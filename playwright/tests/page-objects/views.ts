import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

type ViewIds = 'Runtime Log';

export class Views {
  public readonly panel: Locator;
  public readonly tabs: Locator;

  constructor(readonly page: Page) {
    this.panel = page.locator('#Views');
    this.tabs = page.locator('.views-tabs');
  }

  async openView(view: ViewIds) {
    await this.tabs.getByRole('tab', { name: view }).click();
    await this.expectOpen();
  }

  async open() {
    await expect(this.panel).toBeVisible();
    if ((await this.panel.getAttribute('data-panel-size')) === '0.0') {
      await this.tabs.getByRole('button', { name: 'Toggle Views' }).click();
    }
    await this.expectOpen();
  }

  async close() {
    await expect(this.panel).toBeVisible();
    if ((await this.panel.getAttribute('data-panel-size')) !== '0.0') {
      await this.tabs.getByRole('button', { name: 'Toggle Views' }).click();
    }
    await this.expectClosed();
  }

  async expectOpen() {
    await expect(this.panel).not.toHaveAttribute('data-panel-size', '0.0');
  }

  async expectClosed() {
    await expect(this.panel).toHaveAttribute('data-panel-size', '0.0');
  }
}
