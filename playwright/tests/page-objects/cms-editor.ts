import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class CmsEditor {
  readonly editor: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.editor[data-editor-type="cms"][data-editor-name="${name}"]`);
  }

  async expectOpen(cms?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (cms) {
      await expect(this.rowByName(cms).row).toBeVisible();
    }
  }

  rowByName(name: string) {
    return new CmsEditorRow(this, name);
  }

  async addCo(name: string) {
    await this.editor.getByRole('button', { name: 'Add Content Object' }).click();
    const dialog = this.neo.page.getByRole('dialog');
    await dialog.getByLabel('Name', { exact: true }).fill(name);
    await dialog.getByRole('button', { name: 'Create' }).click();
    return this.rowByName(name);
  }
}

export class CmsEditorRow {
  readonly row: Locator;

  constructor(
    readonly editor: CmsEditor,
    readonly name: string
  ) {
    this.row = editor.editor.locator('.ui-table-row:not(.ui-message-row)').filter({ hasText: name });
  }

  async openInscription() {
    await this.row.click();
    await this.expectSelected();
    return new Inscription(this.editor.neo.page, this.editor.editor.locator('.cms-editor-detail-panel'));
  }

  async expectSelected() {
    await expect(this.row).toHaveAttribute('data-state', 'selected');
  }
}
