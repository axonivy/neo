import { expect, type Locator, type Page } from '@playwright/test';
import { app } from '../integration/app';

export class Overview {
  protected readonly page: Page;
  protected readonly overview: Locator;
  readonly title: Locator;
  readonly search: Locator;
  readonly cards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.overview = page.locator('.overview');
    this.title = this.overview.locator('span').first();
    this.search = this.overview.locator('input');
    this.cards = this.overview.locator('.artifact-card:not(.new-artifact-card)');
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

  async import(name: string, file: string) {
    const card = this.card(name);
    await this.clickCardAction(card, 'Import');
    const dialog = this.page.getByRole('dialog');
    await this.selectImport(dialog, file);
    await dialog.getByRole('button', { name: 'Import' }).click();
  }

  private async selectImport(dialog: Locator, file: string) {
    const fileInput = dialog.locator('input[type=file]');
    const fileChooserPromise = this.page.waitForEvent('filechooser');
    await fileInput.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(file);
  }

  private async selectProject(dialog: Locator, project: string) {
    await dialog.getByRole('combobox', { name: 'Project' }).click();
    await this.page.getByRole('option', { name: `${app}/${project}` }).click();
  }

  async clickCardAction(card: Locator, actionName: string) {
    await card.locator('.card-menu-trigger').click();
    await this.page.getByRole('menu').getByRole('menuitem', { name: actionName }).click();
  }

  async create(name: string, namespace?: string, options?: { file?: string; project?: string }) {
    await this.waitForHiddenSpinner();
    const createCard = this.overview.locator('.new-artifact-card');
    await expect(createCard).toBeVisible();
    await createCard.click();
    const dialog = this.page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.getByLabel('Name').first().fill(name);
    if (namespace) {
      await dialog.getByLabel('Namespace').first().fill(namespace);
    }
    if (options?.file) {
      await this.selectImport(dialog, options.file);
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
}
