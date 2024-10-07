import { expect, type Locator, type Page } from '@playwright/test';
import { ImportDialog } from './import-dialog';

export class Overview {
  protected readonly page: Page;
  protected readonly overview: Locator;
  readonly title: Locator;
  readonly search: Locator;
  readonly cards: Locator;
  readonly infoCards: Locator;
  readonly newCard: Locator;

  constructor(page: Page, index?: number) {
    this.page = page;
    this.overview = index ? page.locator('.overview').nth(index) : page.locator('.overview');
    this.title = this.overview.locator('span').first();
    this.search = this.overview.locator('input');
    this.cards = this.overview.locator('.artifact-card:not(.new-artifact-card)');
    this.infoCards = this.overview.locator('.artifact-info-card');
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

  async create(name: string, namespace?: string, options?: { file?: string; project?: string }) {
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
    await dialog.getByRole('button', { name: 'Create' }).click();
  }

  async expectCardsCountGreaterThan(count: number) {
    await this.waitForHiddenSpinner();
    await expect.poll(async () => this.cards.count()).toBeGreaterThan(count);
  }

  private async waitForHiddenSpinner() {
    await expect(this.overview.locator('.overview-loader')).toBeHidden();
  }

  async clickInfoCard(name: string | RegExp) {
    const card = this.infoCards.filter({ hasText: name });
    await card.getByRole('link').click();
    const overview = new Overview(this.page);
    await expect(overview.title).toHaveText(name);
    await this.page.goBack();
  }
}
