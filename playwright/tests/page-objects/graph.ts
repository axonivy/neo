import { type Locator, type Page } from '@playwright/test';

export class Graph {
  private readonly page: Page;
  private readonly graphRoot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.graphRoot = page.locator('.react-flow__viewport');
  }

  get nodes(): Locator {
    return this.graphRoot.locator('.react-flow__node');
  }

  get edges(): Locator {
    return this.page.locator('.react-flow__edge');
  }

  getNodeByText(text: string | RegExp): GraphNode {
    const locator = this.nodes.filter({ hasText: text }).first();
    return new GraphNode(locator);
  }
}

export class GraphNode {
  private readonly root: Locator;

  constructor(root: Locator) {
    this.root = root;
  }

  get node(): Locator {
    return this.root;
  }

  get jumpInto(): Locator {
    return this.root.locator('button.ui-button');
  }

  get expandNode(): Locator {
    return this.root.locator('i.ivy-chevron');
  }

  get detailSeperator(): Locator {
    return this.root.locator('div[data-orientation="horizontal"][role="none"]');
  }
}
