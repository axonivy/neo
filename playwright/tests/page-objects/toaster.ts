import { expect, type Locator, type Page } from '@playwright/test';

export class Toaster {
  readonly toaster: Locator;

  constructor(readonly page: Page) {
    this.toaster = this.page.locator('.ui-toaster');
  }

  async expectError(message: string) {
    await this.expectType(message, 'error');
  }

  async expectSuccess(message: string) {
    await this.expectType(message, 'success');
  }

  private async expectType(message: string, type: 'error' | 'success') {
    const toast = this.toaster.locator(`li[data-type="${type}"]:has-text("${message}")`);
    await expect(toast).toBeVisible();
    await expect(toast).toHaveAttribute('data-type', type);
  }
}
