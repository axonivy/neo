import { expect, type Locator } from '@playwright/test';
import { Neo } from './neo';

export class DataClassEditor {
  readonly editor: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.data-class-editor[data-editor-name="${name}"]`);
  }

  async waitForOpen(variable?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (variable) {
      await expect(this.rowByName(variable).row).toBeVisible();
    }
  }

  rowByName(name: string) {
    return new DataClassEditorRow(this, name);
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
}
