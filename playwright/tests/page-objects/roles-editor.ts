import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class RoleEditor {
  readonly editor: Locator;

  constructor(readonly neo: Neo, readonly name: string) {
    this.editor = neo.page.locator(`.editor[data-editor-type="roles"][data-editor-name="${name}"]`);
  }

  async expectOpen(role?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (role) {
      await expect(this.rowByName(role).row).toBeVisible();
    }
  }

  rowByName(name: string) {
    return new RoleEditorRow(this, name);
  }
}

export class RoleEditorRow {
  readonly row: Locator;

  constructor(readonly editor: RoleEditor, readonly name: string) {
    this.row = editor.editor.locator(`.ui-table-row:not(.ui-message-row):has-text("${name}")`).first();
  }

  async openInscription() {
    await this.row.click();
    return new Inscription(this.editor.neo.page, this.editor.editor.locator('.role-editor-detail-panel'));
  }

  async expectSelected() {
    await expect(this.row).toHaveAttribute('data-state', 'selected');
  }
}
