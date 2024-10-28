import { ClientJsonRpc } from '@axonivy/dataclass-editor';
import type { DataClassActionArgs } from '@axonivy/dataclass-editor-protocol/lib/types';
import type { MessageConnection } from '@axonivy/jsonrpc';

export type DataClassActionHandler = (action: DataClassActionArgs) => void;

export class DataClassClientNeo extends ClientJsonRpc {
  private actionHandler: DataClassActionHandler;

  constructor(connection: MessageConnection, actionHandler: DataClassActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  action(action: DataClassActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: DataClassActionHandler) {
    const client = new DataClassClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
