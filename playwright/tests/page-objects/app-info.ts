import { expect, type Locator, type Page } from '@playwright/test';
import { Overview } from './overview';

export class AppInfo {
  protected readonly page: Page;
  protected readonly appInfo: Locator;
  readonly title: Locator;
  readonly infoCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.appInfo = page.locator('.app-info');
    this.title = this.appInfo.locator('span').first();
    this.infoCards = this.appInfo.locator('.artifact-info-card');
  }

  async clickInfoCard(name: string) {
    await this.infoCards.locator('span').getByText(name, { exact: true }).click();
    const overview = new Overview(this.page);
    await expect(overview.title).toHaveText(name);
    await this.page.goBack();
  }
}
