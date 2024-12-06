import { expect, type Locator } from '@playwright/test';
import { Neo } from './neo';

export class MonacoEditor {
  readonly editor: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.text-editor[data-editor-name="${name}"]`).frameLocator('#framed-monaco-editor').locator('#editor');
  }

  async waitForOpen(content?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    if (content) {
      await expect(this.editor).toContainText(content);
    }
  }

  async insertTextOnLine(line: number, text: string) {
    const lineNum = this.editor.locator('div.line-numbers').getByText(line.toString());
    await lineNum.click();
    await expect(lineNum).toHaveClass('line-numbers active-line-number');
    await this.neo.page.keyboard.type(text);
    await this.neo.toast.expectSuccess('Saving config completed');
    await expect(this.editor).toContainText(text);
  }
}
