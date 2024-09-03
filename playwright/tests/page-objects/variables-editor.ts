import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class VariableEditor {
  readonly editor: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.variable-editor[data-editor-name="${name}"]`);
  }

  async waitForOpen(variable?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (variable) {
      await expect(this.rowByName(variable).row).toBeVisible();
    }
  }

  rowByName(name: string) {
    return new VariableEditorRow(this, name);
  }
}

export class VariableEditorRow {
  readonly row: Locator;

  constructor(
    readonly editor: VariableEditor,
    readonly name: string
  ) {
    this.row = editor.editor.locator(`.ui-table-row:not(.ui-message-row):has-text("${name}")`);
  }

  async openInscription() {
    await this.row.click();
    return new Inscription(this.editor.neo.page, this.editor.editor.getByTestId('details-container'));
  }

  async expectSelected() {
    await expect(this.row).toHaveAttribute('data-state', 'selected');
  }

  async expectValue(value: string) {
    await expect(this.row.getByRole('cell').last()).toHaveText(value);
  }
}
