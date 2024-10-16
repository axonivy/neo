import { type Locator, type Page } from '@playwright/test';

export class ProjectDetail {
  protected readonly page: Page;
  protected readonly projectDetail: Locator;
  readonly title: Locator;
  readonly detailCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.projectDetail = page.locator('.project-detail');
    this.title = this.projectDetail.locator('span').first();
    this.detailCard = this.projectDetail.locator('.project-detail-card');
  }
}
