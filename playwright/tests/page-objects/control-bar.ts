import { expect, type Locator, type Page } from '@playwright/test';

export class ControlBar {
  protected readonly page: Page;
  protected readonly bar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bar = page.locator('.control-bar');
  }

  tab(name: string | RegExp) {
    return new EditorTab(this.page, this.bar, name);
  }

  tabs() {
    return this.bar.getByRole('tab');
  }

  async toggleBrowser() {
    const button = this.bar.getByRole('button', { name: 'Open Simulation' });
    await button.click();
  }
}

class EditorTab {
  protected readonly page: Page;
  readonly tab: Locator;

  constructor(page: Page, parent: Locator, name: string | RegExp) {
    this.page = page;
    this.tab = parent.getByRole('tab', { name, exact: true });
  }

  async expectActive() {
    await expect(this.tab).toHaveAttribute('data-state', 'active');
  }

  async select() {
    await this.tab.click();
  }
}
