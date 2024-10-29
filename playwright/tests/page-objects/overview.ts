import { expect, type Locator, type Page } from '@playwright/test';
import { ImportDialog } from './import-dialog';

export class Overview {
  protected readonly page: Page;
  protected readonly overview: Locator;
  readonly title: Locator;
  readonly search: Locator;
  readonly cards: Locator;
  readonly newCard: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overview = page.locator('.overview');
    this.title = this.overview.locator('span').first();
    this.search = this.overview.locator('input');
    this.cards = this.overview.locator('.artifact-card:not(.new-artifact-card)');
    this.newCard = this.overview.locator('.new-artifact-card');
  }

  card(name: string | RegExp) {
    return this.cards.filter({ hasText: name }).first();
  }

  async deleteCard(name: string, reload = false) {
    const card = this.card(name);
    await this.clickCardAction(card, 'Delete');
    await this.page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();
    if (reload) {
      // TODO: remove this after fix delete workspace
      await this.page.reload();
      await this.expectCardsCountGreaterThan(0);
    }
    await expect(card).toBeHidden();
  }

  async export(name: string, zipFile: string) {
    const downloadPromise = this.page.waitForEvent('download');
    const card = this.card(name);
    await this.clickCardAction(card, 'Export');
    const download = await downloadPromise;
    await download.saveAs(zipFile);
  }

  private async selectProject(dialog: Locator, project: string) {
    await dialog.getByRole('combobox', { name: 'Project' }).click();
    await this.page.getByRole('option', { name: `${project}` }).click();
  }

  async clickCardAction(card: Locator, actionName: string) {
    await card.locator('.card-menu-trigger').click();
    await this.page.getByRole('menu').getByRole('menuitem', { name: actionName }).click();
  }

  async clickFileImport() {
    await this.clickCardAction(this.newCard, 'Import from File');
  }

  async clickMarketImport() {
    await this.clickCardAction(this.newCard, 'Import from Market');
  }

  async create(name: string, namespace?: string, options?: { file?: string; project?: string; hasDataClassSelect?: boolean }) {
    await this.waitForHiddenSpinner();
    await expect(this.newCard).toBeVisible();
    await this.newCard.click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Name').first().fill(name);
    if (namespace) {
      await dialog.getByLabel('Namespace').first().fill(namespace);
    }
    if (options?.file) {
      await ImportDialog.selectFileImport(dialog, this.page, options.file);
    }
    if (options?.project) {
      await this.selectProject(dialog, options.project);
    }
    expect(await dialog.getByLabel('Caller Data').isVisible()).toBe(options?.hasDataClassSelect ? true : false);
    await dialog.getByRole('button', { name: 'Create' }).click();
  }

  async expectCardsCountGreaterThan(count: number) {
    await this.waitForHiddenSpinner();
    await expect.poll(async () => this.cards.count()).toBeGreaterThan(count);
  }

  private async waitForHiddenSpinner() {
    await expect(this.overview.locator('.overview-loader')).toBeHidden();
  }

  async hoverCard(name: string | RegExp, content: string) {
    const card = this.card(name);
    await card.hover();
    await expect(this.overview.getByRole('tooltip')).toHaveText(content);
  }

  async group(name: string, tagLabel?: string) {
    const groupTitel = tagLabel ? `${name}${tagLabel}` : name;
    const group = this.overview.locator(`.ui-collapsible:has-text("${groupTitel}")`);
    const tag = group.locator('div.artifact-tag');
    if (tagLabel) {
      await expect(tag).toHaveText(tagLabel);
    } else {
      await expect(tag).toBeHidden();
    }
    const trigger = group.locator('button.ui-collapsible-trigger');
    return { group, trigger };
  }

  async hasGroup(name: string, tagLabel?: string, numOfNewCards?: number) {
    const { group, trigger } = await this.group(name, tagLabel);
    await expect(trigger).toHaveAttribute('data-state', 'open');
    const nestedArtifacts = group.locator('.artifact-card');
    expect(await nestedArtifacts.count()).toBeGreaterThan(0);
    const nestedNew = group.locator('.new-artifact-card');
    expect(await nestedNew.count()).toBe(numOfNewCards ?? 1);
  }

  async openGroup(name: string, tagLabel?: string) {
    const { trigger } = await this.group(name, tagLabel);
    await expect(trigger).toHaveAttribute('data-state', 'closed');
    await trigger.click();
    await expect(trigger).toHaveAttribute('data-state', 'open');
  }
}
