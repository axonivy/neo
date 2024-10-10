import { expect, type FrameLocator, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class ProcessEditor {
  readonly editor: Locator;
  readonly frame: FrameLocator;
  readonly graph: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    const frameSelector = `iframe[title="${name}"]`;
    this.editor = neo.page.locator(frameSelector);
    this.frame = neo.page.frameLocator(frameSelector);
    this.graph = this.frame.locator('#sprotty .sprotty-graph');
  }

  async waitForOpen(pid?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    await expect(this.graph).toBeVisible();
    if (pid) {
      await expect(this.elementByPid(pid).element).toBeVisible();
    }
  }

  elementByPid(pid: string) {
    return new ProcessEditorElement(this, pid);
  }
}

export class ProcessEditorElement {
  readonly element: Locator;

  constructor(
    readonly editor: ProcessEditor,
    readonly pid: string
  ) {
    this.element = editor.graph.locator(`#sprotty_${pid}`);
  }

  async triggerQuickAction(name: string | RegExp) {
    await this.element.click();
    await this.expectSelected();
    await this.editor.frame.locator('.quick-actions-bar').getByTitle(name).click();
  }

  async openInscription() {
    await this.element.dblclick();
    return new Inscription(this.editor.neo.page, this.editor.frame.locator(`.inscription-ui-container`));
  }

  async expectSelected() {
    await expect(this.element).toHaveClass(/selected/);
  }

  async expectExecuted() {
    await expect(this.element).toHaveClass(/executed/);
  }
}
