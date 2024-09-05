import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { Browser } from './browser';
import { ControlBar } from './control-bar';
import { Navigation } from './navigation';
import { Overview } from './overview';

export type OverviewTypes = 'Processes' | 'Forms' | 'Configurations' | 'Data Classes';

export class Neo {
  readonly page: Page;
  readonly navigation: Navigation;
  readonly controlBar: ControlBar;

  private constructor(page: Page) {
    this.page = page;
    this.navigation = new Navigation(this.page);
    this.controlBar = new ControlBar(this.page);
  }

  static async open(page: Page) {
    await page.goto('');
    return await Neo.createNeo(page);
  }

  static async openWorkspace(page: Page) {
    await page.goto(`/neo/${process.env.WORKSPACE ?? 'designer'}/`);
    return await Neo.createNeo(page);
  }

  static async openEditor(page: Page, url: string) {
    await page.goto(`/neo/${process.env.WORKSPACE ?? 'designer'}/${url}`);
    return await Neo.createNeo(page);
  }

  private static async createNeo(page: Page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
    return new Neo(page);
  }

  async processes() {
    return await this.navigate('Processes');
  }

  async forms() {
    return await this.navigate('Forms');
  }

  async configs() {
    return await this.navigate('Configurations');
  }

  async dataClasses() {
    return await this.navigate('Data Classes');
  }

  async browser() {
    const browser = new Browser(this.page);
    if (!(await browser.isOpen())) {
      await this.controlBar.toggleBrowser();
      await browser.expectOpen();
    }
    return browser;
  }

  private async navigate(path: OverviewTypes) {
    await this.navigation.open(path);
    const overview = new Overview(this.page);
    await expect(overview.title).toHaveText(path);
    await overview.expectCardsCountGreaterThan(0);
    return overview;
  }
}
