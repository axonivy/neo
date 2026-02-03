import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class RestClientEditor {
  readonly editor: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.editor[data-editor-type="restclients"][data-editor-name="${name}"]`);
  }

  async expectOpen(user?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (user) {
      await expect(this.rowByName(user).row).toBeVisible();
    }
  }

  rowByName(name: string) {
    return new RestClientEditorRow(this, name);
  }
}

export class RestClientEditorRow {
  readonly row: Locator;

  constructor(
    readonly editor: RestClientEditor,
    readonly name: string
  ) {
    this.row = editor.editor.locator(`.ui-table-row:not(.ui-message-row):has-text("${name}")`).first();
  }

  async openInscription() {
    await this.row.click();
    return new Inscription(this.editor.neo.page, this.editor.editor.locator('.restclient-editor-detail-panel'));
  }

  async expectSelected() {
    await expect(this.row).toHaveAttribute('data-state', 'selected');
  }
}
