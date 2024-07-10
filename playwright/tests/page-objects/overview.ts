import { expect, type Locator, type Page } from '@playwright/test';

export class Overview {
  protected readonly page: Page;
  protected readonly overview: Locator;
  readonly title: Locator;
  readonly search: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overview = page.locator('.overview');
    this.title = this.overview.locator('span').first();
    this.search = this.overview.locator('input');
    this.cards = this.overview.locator('.artifact-card:not(.new-artifact-card)');
  }

  card(name: string | RegExp) {
    return this.cards.filter({ hasText: name }).first();
  }

  async deleteCard(name: string, reload = false) {
    const card = this.card(name);
    await expect(card).toBeVisible();
    await card.locator('.card-menu-trigger').click();
    await this.page.getByRole('menu').getByRole('menuitem', { name: 'Delete' }).click();
    await this.page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    if (reload) {
      // TODO: remove this after fix delete workspace
      await this.page.reload();
    }
    await expect(card).toBeHidden();
  }

  async create(name: string, namespace?: string) {
    await this.waitForHiddenSpinner();
    const createCard = this.overview.locator('.new-artifact-card');
    await expect(createCard).toBeVisible();
    await createCard.click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Name').first().fill(name);
    if (namespace) {
      await dialog.getByLabel('Namespace').first().fill(namespace);
    }
    await dialog.getByRole('button', { name: 'Create' }).click();
  }

  async expectCardsCountGreaterThan(count: number) {
    await this.waitForHiddenSpinner();
    await expect.poll(async () => this.cards.count()).toBeGreaterThan(count);
  }

  private async waitForHiddenSpinner() {
    await expect(this.overview.locator('.overview-loader')).toBeHidden();
  }
}
