import { expect, type Locator } from '@playwright/test';
import type { Neo } from './neo';

export class RuntimeLogView {
  readonly view: Locator;

  constructor(readonly neo: Neo) {
    this.view = neo.page.locator('.runtime-log');
  }

  async expectOpen() {
    await expect(this.view).toBeVisible();
  }

  async clear() {
    await this.view.getByRole('button', { name: 'Menu' }).click();
    await this.neo.page.getByRole('menu').getByRole('menuitem', { name: 'Delete All' }).click();
    await expect(this.logs).toHaveCount(0);
  }

  get logs() {
    return this.view.locator('table tbody tr');
  }
}
