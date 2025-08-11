import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

export class Breadcrumbs {
  protected readonly page: Page;
  public readonly navigation: Locator;
  public readonly items: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.locator('.ui-breadcrumb');
    this.items = this.navigation.getByRole('listitem');
  }

  item(name: string) {
    return this.navigation.locator('.ui-breadcrumb-item', { hasText: name });
  }

  async expectItems(items: string[]) {
    await expect(this.items).toHaveCount(items.length);
    for (let i = 0; i < items.length; i++) {
      await expect(this.items.nth(i)).toHaveText(items[i]);
    }
  }
}
