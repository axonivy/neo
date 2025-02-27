import { expect, type Locator } from '@playwright/test';
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
}

export class CmsEditorRow {
  readonly row: Locator;

  constructor(
    readonly editor: CmsEditor,
    readonly name: string
  ) {
    this.row = editor.editor.locator('.ui-table-row:not(.ui-message-row)').filter({ hasText: new RegExp(`^${name}$`) });
  }
}
