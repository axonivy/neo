import { type Locator, type Page } from '@playwright/test';

export class ImportDialog {
  protected readonly page: Page;
  protected readonly dialog: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog');
    this.title = this.dialog.locator('h2');
  }

  async import(file: string) {
    await ImportDialog.selectFileImport(this.dialog, this.page, file);
    await this.dialog.getByRole('button', { name: 'Import' }).click();
  }

  public static async selectFileImport(dialog: Locator, page: Page, file: string) {
    const fileInput = dialog.locator('input[type=file]');
    const fileChooserPromise = page.waitForEvent('filechooser');
    await fileInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(file);
  }
}
