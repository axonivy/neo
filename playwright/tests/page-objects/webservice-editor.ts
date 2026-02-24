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
    return new WebserviceEditorRow(this, { name });
  }

  rowByIndex(index: number) {
    return new WebserviceEditorRow(this, { index });
  }
}

export class WebserviceEditorRow {
  readonly row: Locator;

  constructor(
    readonly editor: WebserviceEditor,
    option: { name?: string; index?: number }
  ) {
    const rowLocator = '.webservice-editor-main-content tbody .ui-table-row:not(.ui-message-row)';
    if (option.name) {
      this.row = editor.editor.locator(`${rowLocator}:has-text("${option.name}")`).first();
    } else if (option.index !== undefined) {
      this.row = editor.editor.locator(rowLocator).nth(option.index);
    } else {
      throw new Error('Either name or index must be provided');
    }
  }

  async openInscription() {
    await this.row.click();
    return new Inscription(this.editor.neo.page, this.editor.editor.locator('.webservice-editor-detail-panel'));
  }

  async expectSelected() {
    await expect(this.row).toHaveAttribute('data-state', 'selected');
  }
}
