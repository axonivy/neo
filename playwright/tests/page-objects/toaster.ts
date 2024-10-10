import { expect, type Locator, type Page } from '@playwright/test';

export class Toaster {
  readonly toaster: Locator;

  constructor(readonly page: Page) {
    this.toaster = this.page.locator('.ui-toaster');
  }

  async expectError(message: string) {
    const toast = this.toaster.locator(`li[data-type="error"]:has-text("${message}")`);
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute('data-type', 'error');
  }
}
