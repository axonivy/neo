import type { MessageConnection } from '@axonivy/jsonrpc';
import { UserClientJsonRpc } from '@axonivy/user-editor';
import type { UserActionArgs } from '@axonivy/user-editor-protocol';

export type UserActionHandler = (action: UserActionArgs) => void;

export class UserClientNeo extends UserClientJsonRpc {
  private actionHandler: UserActionHandler;

  constructor(connection: MessageConnection, actionHandler: UserActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  override action(action: UserActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: (action: UserActionArgs) => void) {
    const client = new UserClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
