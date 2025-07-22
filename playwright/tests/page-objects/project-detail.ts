import { type Locator, type Page } from '@playwright/test';

export class ProjectDetail {
  protected readonly page: Page;
  readonly detailCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.detailCard = this.page.locator('.project-detail-card');
  }
}
