import { CaseMapClientJsonRpc } from '@axonivy/case-map-editor';
import type { CaseMapActionArgs } from '@axonivy/case-map-editor-protocol';
import type { MessageConnection } from '@axonivy/jsonrpc';

export type CaseMapActionHandler = (action: CaseMapActionArgs) => void;

export class CaseMapClientNeo extends CaseMapClientJsonRpc {
  private actionHandler: CaseMapActionHandler;

  constructor(connection: MessageConnection, actionHandler: CaseMapActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  override action(action: CaseMapActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: CaseMapActionHandler) {
    const client = new CaseMapClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
