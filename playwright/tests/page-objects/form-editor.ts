import { expect, type Locator, type Page } from '@playwright/test';

export class FormEditor {
  protected readonly page: Page;
  protected readonly editor: Locator;
  protected readonly canvas: Locator;

  constructor(page: Page, name: string) {
    this.page = page;
    this.editor = page.locator(`.form-editor[data-editor-name="${name}"]`);
    this.canvas = this.editor.locator('#canvas');
  }

  async waitForOpen(block?: string) {
    await expect(this.editor).toBeVisible();
    await expect(this.canvas).toBeVisible();
    if (block) {
      await expect(this.canvas.locator(`.block-input:has-text("${block}")`)).toBeVisible();
    }
  }
}
