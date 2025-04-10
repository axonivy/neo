import type { MessageConnection } from '@axonivy/jsonrpc';
import { LogClientJsonRpc } from '@axonivy/log-view-core';

export class RuntimeLogClientNeo extends LogClientJsonRpc {
  public static async startNeoMessageClient(connection: MessageConnection) {
    const client = new RuntimeLogClientNeo(connection);
    await client.start();
    return client;
  }
}
