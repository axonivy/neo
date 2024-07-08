import { expect, type Locator, type Page } from '@playwright/test';

export class VariableEditor {
  protected readonly page: Page;
  protected readonly editor: Locator;

  constructor(page: Page, name: string) {
    this.page = page;
    this.editor = page.locator(`.variable-editor[data-editor-name="${name}"]`);
  }

  async waitForOpen(variable?: string) {
    await expect(this.editor).toBeVisible();
    if (variable) {
      await expect(this.editor.locator(`.ui-table-row:has-text("${variable}")`)).toBeVisible();
    }
  }
}
