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
    return this.items.getByRole('link', { name });
  }

  async expectItems(items: string[]) {
    await expect(this.items).toHaveCount(items.length - 1);
    for (let i = 0; i < items.length - 1; i++) {
      await expect(this.items.nth(i)).toHaveText(items[i]);
    }
    await expect(this.navigation.locator('.ui-breadcrumb-page')).toHaveText(items.at(-1)!);
  }
}
