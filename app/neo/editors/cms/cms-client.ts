import { ClientJsonRpc } from '@axonivy/cms-editor';
import type { CmsActionArgs } from '@axonivy/cms-editor-protocol';
import type { MessageConnection } from '@axonivy/jsonrpc';

export type CmsActionHandler = (action: CmsActionArgs) => void;

export class CmsClientNeo extends ClientJsonRpc {
  private actionHandler: CmsActionHandler;

  constructor(connection: MessageConnection, actionHandler: CmsActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  action(action: CmsActionArgs) {
    this.actionHandler(action);
    return Promise.resolve();
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: (action: CmsActionArgs) => void) {
    const client = new CmsClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
