import { FormClientJsonRpc } from '@axonivy/form-editor-core';
import { FormActionArgs } from '@axonivy/form-editor-protocol';
import { MessageConnection } from '@axonivy/jsonrpc';

export type FormActionHandler = (action: FormActionArgs) => void;

export class FormClientNeo extends FormClientJsonRpc {
  private actionHandler: FormActionHandler;

  constructor(connection: MessageConnection, actionHandler: FormActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  action(action: FormActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: (action: FormActionArgs) => void) {
    const client = new FormClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
