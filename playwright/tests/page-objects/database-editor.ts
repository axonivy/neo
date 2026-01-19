import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class DatabaseEditor {
  readonly editor: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.editor[data-editor-type="databases"][data-editor-name="${name}"]`);
  }

  async expectOpen(database?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (database) {
      await expect(this.rowByName(database).row).toBeVisible();
    }
  }

  rowByName(name: string) {
    return new DatabaseEditorRow(this, name);
  }
}

export class DatabaseEditorRow {
  readonly row: Locator;

  constructor(
    readonly editor: DatabaseEditor,
    readonly name: string
  ) {
    this.row = editor.editor.locator(`.ui-table-row:not(.ui-message-row):has-text("${name}")`).first();
  }

  async openInscription() {
    await this.row.click();
    return new Inscription(this.editor.neo.page, this.editor.editor.locator('.database-editor-detail-panel'));
  }

  async expectSelected() {
    await expect(this.row).toHaveAttribute('data-state', 'selected');
  }
}
