import { expect, type Locator, type Page } from '@playwright/test';
import { Graph } from './graph';
import { ImportDialog } from './import-dialog';
import { ValidationMessage } from './validation-message';

export class Overview {
  protected readonly page: Page;
  protected readonly overview: Locator;
  protected readonly titleSection: Locator;
  readonly title: Locator;
  readonly createButton: Locator;
  readonly search: Locator;
  readonly filter: OverviewFilter;
  readonly viewToggle: Locator;
  readonly cards: Locator;
  readonly recentlyOpenedCards: Locator;
  readonly infoCards: Locator;
  readonly graph: Graph;

  constructor(page: Page) {
    this.page = page;
    this.overview = page.locator('.overview');
    this.titleSection = this.overview.locator('.overview-title-section');
    this.title = this.titleSection.locator('.overview-title');
    this.createButton = this.titleSection.getByRole('button').last();
    this.search = this.overview.locator('input');
    this.filter = new OverviewFilter(page, this.overview);
    this.cards = this.overview.locator('.artifact-card:not(.recently-opened-card)');
    this.recentlyOpenedCards = this.overview.locator('.artifact-card.recently-opened-card');
    this.infoCards = this.overview.locator('.overview-info-card');
    this.viewToggle = this.overview.locator('.ui-toggle-group');
    this.graph = new Graph(page);
  }

  card(name: string | RegExp) {
    return this.cards.filter({ hasText: name }).first();
  }

  async deleteCard(name: string, reload = false, label = 'Delete') {
    const card = this.card(name);
    await this.clickCardAction(card, label);
    await this.page.getByRole('dialog').getByRole('button', { name: label }).click();
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
    await this.titleSection.getByRole('button', { name: 'Import Projects' }).click();
    await this.page.getByRole('menuitem').getByText('Import from File').click();
  }

  async clickMarketImport() {
    await this.titleSection.getByRole('button', { name: 'Import Projects' }).click();
    await this.page.getByRole('menuitem').getByText('Import from Market').click();
  }

  async clickCreateProject(projectName: string) {
    await this.titleSection.getByRole('button', { name: 'Create new Project' }).click();
    await expect(this.page.locator('text=A Project is the basement for your Processes')).toBeVisible();
    const nameInput = this.page.getByLabel('Name');
    await nameInput.fill(projectName);
    await this.page.getByRole('button', { name: 'Optional' }).click();
    const groupIdInput = this.page.getByLabel('Group-Id');
    await groupIdInput.fill('modified.groupId');
    await this.page.getByRole('button', { name: 'Create' }).click();
  }

  async clickSortByAtoZ() {
    await this.page.getByRole('button', { name: 'Sort By' }).click();
    await this.page.getByRole('menuitem').getByText('A to Z').click();
  }

  async clickSortByZtoA() {
    await this.page.getByRole('button', { name: 'Sort By' }).click();
    await this.page.getByRole('menuitem').getByText('Z to A').click();
  }

  async checkCreateValidationMessage(options: {
    name?: string;
    namespace?: string;
    nameWarning?: string;
    nameError?: string;
    namespaceError?: string;
  }) {
    await this.waitForHiddenSpinner();
    const dialog = this.page.getByRole('dialog');
    if (await dialog.isHidden()) {
      await this.createButton.click();
    }
    const nameInput = dialog.getByLabel('Name').first();
    const namespaceInput = dialog.getByLabel('Namespace').first();
    if (options.name !== undefined) {
      await nameInput.fill(options.name);
    }
    if (options.namespace !== undefined) {
      await namespaceInput.fill(options.namespace);
    }
    const createButton = dialog.getByRole('button', { name: 'Create' });
    if (options.nameWarning) {
      await new ValidationMessage(nameInput).expectWarning(options.nameWarning);
    }
    if (options.nameError) {
      await new ValidationMessage(nameInput).expectError(options.nameError);
      await expect(createButton).toBeDisabled();
    }
    if (options.namespaceError) {
      await new ValidationMessage(namespaceInput).expectError(options.namespaceError);
      await expect(createButton).toBeDisabled();
    }
    if (options.nameError === undefined && options.namespaceError === undefined) {
      await expect(createButton).toBeEnabled();
    }
  }

  async create(
    name: string,
    namespace?: string,
    options?: { file?: string; project?: string; hasDataClassSelect?: boolean; useKeyToCreate?: boolean }
  ) {
    await this.waitForHiddenSpinner();
    await expect(this.createButton).toBeVisible();
    await this.createButton.click();
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
    if (options?.hasDataClassSelect) {
      await expect(dialog.getByLabel('Caller Data')).toBeVisible();
    } else {
      await expect(dialog.getByLabel('Caller Data')).toBeHidden();
    }
    if (options?.useKeyToCreate) {
      await this.page.keyboard.press('Enter');
    } else {
      await dialog.getByRole('button', { name: 'Create' }).click();
    }
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
    await expect(this.page.getByRole('tooltip')).toHaveText(content);
  }

  async hasCardWithTag(name: string, tagLabel?: string) {
    if (tagLabel) {
      await expect(this.card(name).locator('.artifact-tag', { hasText: tagLabel })).toBeVisible();
    } else {
      await expect(this.card(name).locator('.artifact-tag')).toBeHidden();
    }
  }

  async clickInfoCard(name: string, filterTag?: string) {
    await this.infoCards.locator('span').getByText(name, { exact: true }).click();
    const overview = new Overview(this.page);
    await expect(overview.title.first()).toHaveText(name);
    if (filterTag) {
      await expect(overview.filter.filterTag(filterTag)).toBeVisible();
    }
    await this.page.goBack();
  }
}
class OverviewFilter {
  readonly button: Locator;
  readonly badge: Locator;
  readonly menu: Locator;
  readonly tags: Locator;

  constructor(
    readonly page: Page,
    readonly parent: Locator
  ) {
    this.button = parent.getByRole('button', { name: 'Filter by' });
    this.badge = parent.locator('.overview-filter-badge');
    this.menu = this.page.getByRole('menu', { name: 'Filter by' });
    this.tags = this.parent.locator('.overview-filter-tags');
  }

  async openFilter() {
    await this.button.click();
    await expect(this.menu).toBeVisible();
  }

  async filterProject(project: string) {
    await this.openFilter();
    await this.menu.getByRole('menuitemcheckbox', { name: project }).click();
    await expect(this.menu).toBeVisible();
    await this.page.keyboard.press('Escape');
    await expect(this.menu).toBeHidden();
    await expect(this.filterTag(project)).toBeVisible();
    await expect(this.badge).toBeVisible();
  }

  async resetFilter() {
    await this.openFilter();
    await this.page.getByRole('menuitem', { name: 'Reset all Filters' }).click();
    await expect(this.menu).toBeHidden();
    await expect(this.tags).toBeHidden();
    await expect(this.badge).toBeHidden();
  }

  filterTag(tag: string) {
    return this.tags.locator('.overview-filter-tag', { hasText: tag });
  }
}
