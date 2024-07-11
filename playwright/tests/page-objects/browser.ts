import { expect, FrameLocator, type Locator, type Page } from '@playwright/test';

export class Browser {
  protected readonly page: Page;
  protected readonly browser: Locator;
  readonly browserView: FrameLocator;

  constructor(page: Page) {
    this.page = page;
    this.browser = page.locator('#Browser');
    this.browserView = this.browser.frameLocator('iframe');
  }

  async isOpen() {
    return await this.browser.isVisible();
  }

  async expectOpen() {
    await expect(this.browser).toBeVisible();
    await expect(this.browserView.locator('.layout-designer')).toBeVisible({ timeout: 10000 });
  }

  async expectClosed() {
    await expect(this.browser).toBeHidden();
  }

  async startProcess(name: string) {
    await this.browserView.locator(`#menuform\\:sr_starts`).click();
    await this.browserView.locator(`.start-link:has-text("${name}")`).click();
  }
}
