import { expect, type Locator } from '@playwright/test';

export class ValidationMessage {
  readonly message: Locator;

  constructor(readonly input: Locator) {
    this.message = this.input.locator('..').locator('p.ui-message');
  }

  async expectError(text: string) {
    await this.expectType(text, 'error');
  }

  async expectWarning(text: string) {
    await this.expectType(text, 'warning');
  }

  private async expectType(text: string, type: 'error' | 'warning') {
    await expect(this.message).toBeVisible();
    await expect(this.message).toHaveAttribute('data-state', type);
    await expect(this.message).toHaveText(text);
  }
}
