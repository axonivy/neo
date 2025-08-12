import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import { WORKSPACE } from '../integration/constants';
import { Breadcrumbs } from './breadcrumbs';
import { Browser } from './browser';
import { ControlBar } from './control-bar';
import { Navigation } from './navigation';
import { Overview } from './overview';
import { Toaster } from './toaster';
import { Views } from './views';

export type OverviewTypes = 'Processes' | 'Forms' | 'Configurations' | 'Data Classes' | 'Workspace';

export class Neo {
  readonly page: Page;
  readonly navigation: Navigation;
  readonly breadcrumbs: Breadcrumbs;
  readonly views: Views;
  readonly controlBar: ControlBar;

  private constructor(page: Page) {
    this.page = page;
    this.navigation = new Navigation(this.page);
    this.breadcrumbs = new Breadcrumbs(this.page);
    this.views = new Views(this.page);
    this.controlBar = new ControlBar(this.page);
  }

  static async open(page: Page) {
    await page.goto('');
    return await Neo.createNeo(page);
  }

  static async openWorkspace(page: Page, url?: string) {
    await page.goto(`/neo/${WORKSPACE}/${url ?? ''}`);
    return await Neo.createNeo(page);
  }

  static async exportWorkspace(page: Page, zipFile: string) {
    const neo = await Neo.open(page);
    const overview = new Overview(page);
    await overview.export(WORKSPACE, zipFile);
    expect(fs.existsSync(zipFile)).toBeTruthy();
    return { neo, overview };
  }

  private static async createNeo(page: Page) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.addStyleTag({ content: `.tsqd-parent-container { display: none; }` });
    return new Neo(page);
  }

  get toast() {
    return new Toaster(this.page);
  }

  async home() {
    return await this.navigate('Workspace', 'Projects');
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

  private async navigate(path: OverviewTypes, title?: string) {
    await this.navigation.open(path);
    const overview = new Overview(this.page);
    await expect(overview.title.last()).toHaveText(title ?? path);
    await overview.expectCardsCountGreaterThan(0);
    return overview;
  }
}
