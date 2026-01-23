import { ClientJsonRpc } from '@axonivy/database-editor';
import type { DatabaseActionArgs } from '@axonivy/database-editor-protocol/lib/editor';
import type { MessageConnection } from '@axonivy/jsonrpc';

export type DatabaseActionHandler = (action: DatabaseActionArgs) => void;

export class DatabaseClientNeo extends ClientJsonRpc {
  private actionHandler: DatabaseActionHandler;

  constructor(connection: MessageConnection, actionHanlder: DatabaseActionHandler) {
    super(connection);
    this.actionHandler = actionHanlder;
  }

  override action(action: DatabaseActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: DatabaseActionHandler) {
    const client = new DatabaseClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
