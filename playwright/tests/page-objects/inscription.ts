import { type Locator, type Page, expect } from '@playwright/test';

export class Inscription {
  constructor(
    readonly page: Page,
    readonly inscription: Locator
  ) {}

  async openInscriptionTab(name: string) {
    const inscriptionTabHeader = this.inscription.getByRole('tab', { name: name });
    await expect(inscriptionTabHeader).toBeVisible();
    if ((await inscriptionTabHeader.getAttribute('aria-selected')) !== 'true') {
      await inscriptionTabHeader.click();
    }
  }

  async openSection(name: string) {
    const sectionTrigger = this.inscription.locator(`.ui-collapsible-trigger:has-text("${name}")`);
    await expect(sectionTrigger).toBeVisible();
    if ((await sectionTrigger.getAttribute('data-state')) === 'closed') {
      await sectionTrigger.click();
    }
  }

  monacoEditor() {
    return this.inscription.locator('.view-lines.monaco-mouse-cursor-text');
  }

  badgedInput(label: string) {
    return new BadgedInput(this.page, this.inscription, label);
  }

  private monacoContentAssist() {
    return this.inscription.locator('div.editor-widget.suggest-widget');
  }

  async triggerMonacoContentAssist() {
    const contentAssist = this.monacoContentAssist();
    await expect(contentAssist).toBeHidden();
    await this.page.keyboard.press('Control+Space');
    await expect(contentAssist).toBeVisible();
  }

  async triggerMonacoCompletion(expectedCompletion: string) {
    const contentAssist = this.monacoContentAssist();
    await expect(contentAssist).toBeVisible();
    await contentAssist.getByRole('listitem', { name: expectedCompletion, exact: true }).click();
    await expect(contentAssist).toBeHidden();
  }

  async typeText(text: string, delay = 5) {
    await this.page.keyboard.type(text, { delay });
  }
}

export class BadgedInput {
  readonly input: Locator;

  constructor(
    readonly page: Page,
    readonly parent: Locator,
    label: string
  ) {
    this.input = parent.getByLabel(label);
  }

  async fill(text: string) {
    await this.input.click();
    await this.input.fill(text);
    await this.input.blur();
  }

  async expectBadgeValue(text: string) {
    await expect(this.input).toHaveText(text);
  }
}
