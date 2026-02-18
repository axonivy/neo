import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class PersistenceEditor {
  readonly editor: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.editor[data-editor-type="persistence"][data-editor-name="${name}"]`);
  }

  async expectOpen(unit?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (unit) {
      await expect(this.rowByName(unit).row).toBeVisible();
    }
  }

  rowByName(name: string) {
    return new PersistenceEditorRow(this, name);
  }
}

export class PersistenceEditorRow {
  readonly row: Locator;

  constructor(
    readonly editor: PersistenceEditor,
    readonly name: string
  ) {
    this.row = editor.editor.locator(`.ui-table-row:not(.ui-message-row):has-text("${name}")`).first();
  }

  async openInscription() {
    await this.row.click();
    return new Inscription(this.editor.neo.page, this.editor.editor.locator('.persistence-editor-detail-panel'));
  }

  async expectSelected() {
    await expect(this.row).toHaveAttribute('data-state', 'selected');
  }
}
