import type { MessageConnection } from '@axonivy/jsonrpc';
import { RestClientClientJsonRpc } from '@axonivy/restclient-editor';
import type { RestClientActionArgs } from '@axonivy/restclient-editor-protocol';

export type RestClientActionHandler = (action: RestClientActionArgs) => void;

export class RestClientClientNeo extends RestClientClientJsonRpc {
  private actionHandler: RestClientActionHandler;

  constructor(connection: MessageConnection, actionHandler: RestClientActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  override action(action: RestClientActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: (action: RestClientActionArgs) => void) {
    const client = new RestClientClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
