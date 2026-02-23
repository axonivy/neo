import type { MessageConnection } from '@axonivy/jsonrpc';
import { WebServiceClientJsonRpc } from '@axonivy/webservice-editor';
import type { WebServiceActionArgs } from '@axonivy/webservice-editor-protocol';

export type WebserviceActionHandler = (action: WebServiceActionArgs) => void;

export class WebserviceClientNeo extends WebServiceClientJsonRpc {
  private actionHandler: WebserviceActionHandler;

  constructor(connection: MessageConnection, actionHandler: WebserviceActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  override action(action: WebServiceActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: WebserviceActionHandler) {
    const client = new WebserviceClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
