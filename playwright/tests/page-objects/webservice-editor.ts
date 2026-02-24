import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class WebserviceEditor {
  readonly editor: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.editor[data-editor-type="webservices"][data-editor-name="${name}"]`);
  }

  async expectOpen(service?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (service) {
      await expect(this.rowByName(service).row).toBeVisible();
    }
  }

  rowByName(name: string) {
    return new WebserviceEditorRow(this, name);
  }
}

export class WebserviceEditorRow {
  readonly row: Locator;

  constructor(
    readonly editor: WebserviceEditor,
    readonly name: string
  ) {
    this.row = editor.editor.locator(`.ui-table-row:not(.ui-message-row):has-text("${name}")`).first();
  }

  async openInscription() {
    await this.row.click();
    return new Inscription(this.editor.neo.page, this.editor.editor.locator('.webservice-editor-detail-panel'));
  }

  async expectSelected() {
    await expect(this.row).toHaveAttribute('data-state', 'selected');
  }
}
