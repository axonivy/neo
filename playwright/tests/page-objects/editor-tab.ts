import type { Locator, Page } from '@playwright/test';

export class EditorTab {
  protected readonly page: Page;
  readonly tab: Locator;

  constructor(page: Page, bar: Locator, name: string) {
    this.page = page;
    this.tab = bar.getByRole('tab', { name });
  }
}
