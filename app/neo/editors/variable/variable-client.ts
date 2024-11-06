import type { MessageConnection } from '@axonivy/jsonrpc';
import { ClientJsonRpc } from '@axonivy/variable-editor';
import type { VariablesActionArgs } from '@axonivy/variable-editor-protocol';

export type VariableActionHandler = (action: VariablesActionArgs) => void;

export class VariableClientNeo extends ClientJsonRpc {
  private actionHandler: VariableActionHandler;

  constructor(connection: MessageConnection, actionHandler: VariableActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  action(action: VariablesActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: (action: VariablesActionArgs) => void) {
    const client = new VariableClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
