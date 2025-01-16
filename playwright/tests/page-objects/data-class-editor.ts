import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class DataClassEditor {
  readonly editor: Locator;
  readonly rows: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.editor[data-editor-type="dataclasses"][data-editor-name="${name}"]`);
    this.rows = this.editor.locator('tbody tr');
  }

  async expectOpen(dataClass?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (dataClass) {
      await expect(this.rowByName(dataClass).row).toBeVisible();
    }
  }

  rowByName(name: string) {
    return new DataClassEditorRow(this, name);
  }

  async addField() {
    await this.editor.getByRole('button', { name: 'Add Attribute' }).click();
    await this.neo.page.getByRole('button', { name: 'Create Attribute' }).click();
  }

  async deleteField() {
    await this.editor.getByRole('button', { name: 'Delete Attribute' }).click();
  }
}

export class DataClassEditorRow {
  readonly row: Locator;

  constructor(
    readonly editor: DataClassEditor,
    readonly name: string
  ) {
    this.row = editor.editor.locator(`.ui-table-row:not(.ui-message-row):has-text("${name}")`);
  }

  async openInscription() {
    await this.row.click();
    return new Inscription(this.editor.neo.page, this.editor.editor.locator('.detail-container'));
  }
}
