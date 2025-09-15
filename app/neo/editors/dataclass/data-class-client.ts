import { ClientJsonRpc } from '@axonivy/dataclass-editor';
import type { DataActionArgs } from '@axonivy/dataclass-editor-protocol/lib/editor';
import type { MessageConnection } from '@axonivy/jsonrpc';

export type DataClassActionHandler = (action: DataActionArgs) => void;

export class DataClassClientNeo extends ClientJsonRpc {
  private actionHandler: DataClassActionHandler;

  constructor(connection: MessageConnection, actionHandler: DataClassActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  override action(action: DataActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: DataClassActionHandler) {
    const client = new DataClassClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
