import { ClientJsonRpc } from '@axonivy/database-editor';
import type { MessageConnection } from '@axonivy/jsonrpc';

export class DatabaseClientNeo extends ClientJsonRpc {
  public static async startNeoMessageClient(connection: MessageConnection) {
    const client = new DatabaseClientNeo(connection);
    await client.start();
    return client;
  }
}
