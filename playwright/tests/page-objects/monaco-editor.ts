import { expect, type Locator } from '@playwright/test';
import { Neo } from './neo';

export class MonacoEditor {
  readonly editor: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page
      .locator(`.editor[data-editor-type="configurations"][data-editor-name="${name}"]`)
      .frameLocator('#framed-monaco-editor')
      .locator('#editor');
  }

  async expectOpen(content?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (content) {
      await expect(this.editor).toContainText(content);
    }
  }

  async insertTextOnLine(line: number, text: string) {
    const lineNum = this.editor.locator('.line-numbers').getByText(line.toString());
    await lineNum.click();
    await this.neo.page.keyboard.type(text);
    await this.neo.toast.expectSuccess('Saving config completed');
    await expect(this.editor).toContainText(text);
  }

  async cleanLine(line: number) {
    const lineNum = this.editor.locator('.line-numbers').getByText(line.toString());
    await lineNum.click();
    await this.neo.page.keyboard.press('Delete');
    await this.neo.toast.expectSuccess('Saving config completed');
  }
}
