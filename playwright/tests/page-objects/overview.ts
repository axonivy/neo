import { expect, type Locator, type Page } from '@playwright/test';
import { Graph } from './graph';
import { ImportDialog } from './import-dialog';
import { ValidationMessage } from './validation-message';

export class Overview {
  protected readonly page: Page;
  protected readonly overview: Locator;
  readonly title: Locator;
  readonly search: Locator;
  readonly viewToggle: Locator;
  readonly cards: Locator;
  readonly createNewButton: Locator;
  readonly graph: Graph;

  constructor(page: Page) {
    this.page = page;
    this.overview = page.locator('.overview');
    this.title = this.overview.locator('span').first();
    this.search = this.overview.locator('input');
    this.cards = this.overview.locator('.artifact-card');
    this.createNewButton = this.overview.locator('.createNewButton').getByRole('button');
    this.viewToggle = this.overview.locator('.ui-toggle-group');
    this.graph = new Graph(page);
  }

  card(name: string | RegExp) {
    return this.cards.filter({ hasText: name }).first();
  }

  async deleteCard(name: string, reload = false, label = 'Delete') {
    const card = this.card(name);
    await this.clickCardAction(card, label);
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
    await this.createNewButton.click();
    await this.page.getByRole('menuitem').getByText('Import from File').click();
  }

  async clickMarketImport() {
    await this.createNewButton.click();
    await this.page.getByRole('menuitem').getByText('Import from Market').click();
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
      await this.createNewButton.click();
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
    await expect(this.createNewButton).toBeVisible();
    await this.createNewButton.click();
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

  async group(name: string, tagLabel?: string) {
    const groupTitel = tagLabel ? `${name}${tagLabel}` : name;
    const group = this.overview.locator(`.ui-collapsible:has-text("${groupTitel}")`);
    const trigger = group.locator('button.ui-collapsible-trigger');
    await this.hasTag(trigger, tagLabel);
    return { group, trigger };
  }

  private async hasTag(locator: Locator, tagLabel?: string) {
    const tag = locator.locator('.artifact-tag');
    if (tagLabel) {
      await expect(tag).toHaveText(tagLabel);
    } else {
      await expect(tag).toBeHidden();
    }
  }

  async hasGroup(name: string, tagLabel?: string, numOfNewCards?: number) {
    const { group, trigger } = await this.group(name, tagLabel);
    await expect(trigger).toHaveAttribute('data-state', 'open');
    const nestedNew = group.locator('.new-artifact-card');
    await expect(nestedNew).toHaveCount(numOfNewCards ?? 0);
  }

  async hasCardWithTag(name: string, tagLabel?: string) {
    const card = this.card(name);
    await this.hasTag(card, tagLabel);
  }

  async openGroup(name: string, tagLabel?: string) {
    const { trigger } = await this.group(name, tagLabel);
    await expect(trigger).toHaveAttribute('data-state', 'closed');
    await trigger.click();
    await expect(trigger).toHaveAttribute('data-state', 'open');
  }
}
