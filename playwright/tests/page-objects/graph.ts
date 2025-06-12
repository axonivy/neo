import { type Locator, type Page } from '@playwright/test';

export class Graph {
  private readonly page: Page;
  private readonly graphRoot: Locator;

  constructor(page: Page) {
    this.page = page;
    this.graphRoot = page.locator('.react-flow');
  }

  get nodes(): Locator {
    return this.graphRoot.locator('.react-flow__node');
  }

  get edges(): Locator {
    return this.graphRoot.locator('.react-flow__edge');
  }

  get horizontalAlignButton(): Locator {
    return this.graphRoot.locator('.react-flow__panel.top.right button[title="horizontal alignment"]');
  }

  get fitViewButton(): Locator {
    return this.graphRoot.locator('.react-flow__panel.bottom.right').getByRole('button', { name: 'fit view' });
  }

  getNodeByText(text: string | RegExp): GraphNode {
    const locator = this.nodes.filter({ hasText: text }).first();
    return new GraphNode(locator);
  }
}

export class GraphNode {
  constructor(readonly node: Locator) {}

  get jumpInto(): Locator {
    return this.node.getByRole('button', { name: 'Open' });
  }

  get expandNode(): Locator {
    return this.node.getByRole('button', { name: 'Expand node' });
  }
}
