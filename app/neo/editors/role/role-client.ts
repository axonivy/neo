import type { MessageConnection } from '@axonivy/jsonrpc';
import { RoleClientJsonRpc } from '@axonivy/role-editor';
import type { RoleActionArgs } from '@axonivy/role-editor-protocol';

export type RoleActionHandler = (action: RoleActionArgs) => void;

export class RoleClientNeo extends RoleClientJsonRpc {
  private actionHandler: RoleActionHandler;

  constructor(connection: MessageConnection, actionHandler: RoleActionHandler) {
    super(connection);
    this.actionHandler = actionHandler;
  }

  override action(action: RoleActionArgs) {
    this.actionHandler(action);
  }

  public static async startNeoMessageClient(connection: MessageConnection, actionHandler: (action: RoleActionArgs) => void) {
    const client = new RoleClientNeo(connection, actionHandler);
    await client.start();
    return client;
  }
}
