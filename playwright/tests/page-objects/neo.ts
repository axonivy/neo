import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import { workspace } from '../integration/constants';
import { Browser } from './browser';
import { ControlBar } from './control-bar';
import { Navigation } from './navigation';
import { Overview } from './overview';

export type OverviewTypes = 'Processes' | 'Forms' | 'Configurations' | 'Data Classes' | 'Application Home' | 'Market';

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
    await page.goto(`/neo/${workspace}/`);
    return await Neo.createNeo(page);
  }

  static async openEditor(page: Page, url: string) {
    await page.goto(`/neo/${workspace}/${url}`);
    return await Neo.createNeo(page);
  }

  static async exportWorkspace(page: Page, zipFile: string) {
    const neo = await Neo.open(page);
    const overview = new Overview(page);
    await overview.export(workspace, zipFile);
    expect(fs.existsSync(zipFile)).toBeTruthy();
    return { neo, overview };
  }

  private static async createNeo(page: Page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
    return new Neo(page);
  }

  async home() {
    return await this.navigate('Application Home', `Welcome to your application: ${workspace}`);
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

  async market() {
    return await this.navigate('Market', 'Axon Ivy Market');
  }

  async fileImport() {
    return await this.navigation.openImport('File Import');
  }

  async browser() {
    const browser = new Browser(this.page);
    if (!(await browser.isOpen())) {
      await this.controlBar.toggleBrowser();
      await browser.expectOpen();
    }
    return browser;
  }

  private async navigate(path: OverviewTypes, title?: string) {
    await this.navigation.open(path);
    const overview = new Overview(this.page);
    await expect(overview.title).toHaveText(title ?? path);
    await overview.expectCardsCountGreaterThan(0);
    return overview;
  }
}
