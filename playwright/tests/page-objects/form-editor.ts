import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class FormEditor {
  readonly editor: Locator;
  readonly canvas: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.form-editor[data-editor-name="${name}"]`);
    this.canvas = this.editor.locator('#canvas');
  }

  async expectOpen(block?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    await expect(this.canvas).toBeVisible();
    if (block) {
      await expect(this.blockByName(block).block).toBeVisible();
    }
  }

  blockByName(name: string) {
    return new FormEditorBlock(this, name);
  }
}

export class FormEditorBlock {
  readonly block: Locator;

  constructor(
    readonly editor: FormEditor,
    readonly name: string
  ) {
    this.block = editor.canvas.locator(`.draggable:has-text("${name}")`);
  }

  async openInscription() {
    await this.block.dblclick();
    return new Inscription(this.editor.neo.page, this.editor.editor.locator(`.properties`));
  }

  async expectSelected() {
    await expect(this.block).toHaveClass(/selected/);
  }

  async expectInputValue(value: string) {
    await expect(this.block.locator('.block-input__input')).toHaveText(value);
  }
}
