import { expect, type Locator, type Page } from '@playwright/test';

export class Overview {
  protected readonly page: Page;
  protected readonly overview: Locator;
  readonly title: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overview = page.locator('.overview');
    this.title = this.overview.locator('span').first();
    this.cards = this.overview.locator('.artifact-card:not(.new-artifact-card)');
  }

  card(name: string | RegExp) {
    return this.cards.filter({ hasText: name }).first();
  }

  async waitForHiddenSpinner() {
    await expect(this.overview.locator('.overview-loader')).toBeHidden();
  }
}
