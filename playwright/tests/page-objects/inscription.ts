import { Locator, Page, expect } from '@playwright/test';

export class Inscription {
  constructor(readonly page: Page, readonly inscription: Locator) {}

  async openAccordion(name: string) {
    const accordionHeader = this.inscription.locator(`.ui-accordion-header:has-text("${name}")`);
    await expect(accordionHeader).toBeVisible();
    if ((await accordionHeader.getAttribute('data-state')) === 'closed') {
      await accordionHeader.click();
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
    await contentAssist.getByRole('option', { name: expectedCompletion, exact: true }).click();
    await expect(contentAssist).toBeHidden();
  }

  async typeText(text: string, delay = 5) {
    await this.page.keyboard.type(text, { delay });
  }
}
