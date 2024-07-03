import { expect, FrameLocator, type Locator, type Page } from '@playwright/test';

export class ProcessEditor {
  protected readonly page: Page;
  protected readonly editor: Locator;
  protected readonly frame: FrameLocator;
  protected readonly graph: Locator;

  constructor(page: Page, name: string) {
    this.page = page;
    const frameSelector = `iframe[title="${name}"]`;
    this.editor = page.locator(frameSelector);
    this.frame = page.frameLocator(frameSelector);
    this.graph = this.frame.locator('#sprotty .sprotty-graph');
  }

  async waitForOpen(id?: string) {
    await expect(this.editor).toBeVisible();
    await expect(this.graph).toBeVisible();
    if (id) {
      await expect(this.graph.locator(`#sprotty_${id}`)).toBeVisible();
    }
  }
}
