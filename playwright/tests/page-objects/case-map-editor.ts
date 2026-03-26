import { expect, type Locator } from '@playwright/test';
import { Inscription } from './inscription';
import { Neo } from './neo';

export class CaseMapEditor {
  readonly editor: Locator;
  readonly flow: Locator;

  constructor(
    readonly neo: Neo,
    readonly name: string
  ) {
    this.editor = neo.page.locator(`.editor[data-editor-type="casemaps"][data-editor-name="${name}"]`);
    this.flow = this.editor.locator('#case-map-editor-main');
  }

  async expectOpen(stage?: string) {
    await this.neo.controlBar.tab(this.name).expectActive();
    await expect(this.editor).toBeVisible();
    await expect(this.flow).toBeVisible();
    if (stage) {
      await expect(this.stageByName(stage).stage).toBeVisible();
    }
  }

  stageByName(name: string) {
    return new CaseMapEditorStage(this, name);
  }
}

export class CaseMapEditorStage {
  readonly stage: Locator;

  constructor(
    readonly editor: CaseMapEditor,
    readonly name: string
  ) {
    this.stage = editor.flow.locator('[data-element-type="stage"]', { hasText: name });
  }

  async openInscription() {
    await this.stage.dblclick({ position: { x: 10, y: 10 } });
    return new Inscription(this.editor.neo.page, this.editor.editor.locator('#case-map-editor-detail'));
  }
}
