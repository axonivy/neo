import type { MessageConnection } from '@axonivy/jsonrpc';
import { PersistenceClientJsonRpc } from '@axonivy/persistence-editor';
import type { PersistenceActionArgs } from '@axonivy/persistence-editor-protocol';

export type PersistenceActionHandler = (action: PersistenceActionArgs) => void;

export class PersistenceClientNeo extends PersistenceClientJsonRpc {
  private actionHandler: PersistenceActionHandler;

  constructor(connection: MessageConnection, actionHandler: PersistenceActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  override action(action: PersistenceActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: (action: PersistenceActionArgs) => void) {
    const client = new PersistenceClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
