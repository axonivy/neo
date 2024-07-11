import { BaseRpcClient } from '@axonivy/jsonrpc/lib/base-rpc-client';
import { Connection } from '@axonivy/jsonrpc/lib/connection-util';
import { createMessageConnection, Disposable } from '@axonivy/jsonrpc/lib/re-exports';
import { Callback, NeoClient } from './neo-protocol';
import { Process } from './process-api';

export interface NeoOnNotificationTypes {}

export interface NeoOnRequestTypes {
  openEditor: [Process, boolean];
}

export type AnimationSettings = {
  animate: boolean;
  speed: number;
};

export interface NeoRequestTypes {}

export interface NeoNotificationTypes {
  animationSettings: [AnimationSettings];
}

export class NeoClientJsonRpc extends BaseRpcClient implements NeoClient {
  onOpenEditor = new Callback<Process, boolean>();
  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onOpenEditor);
    this.onRequest('openEditor', data => this.onOpenEditor.call(data) ?? false);
  }

  animationSettings(settings: AnimationSettings) {
    return this.sendNotification('animationSettings', settings);
  }

  sendRequest<K extends keyof NeoRequestTypes>(command: K, args: NeoRequestTypes[K][0]): Promise<NeoRequestTypes[K][1]> {
    return args === undefined ? this.connection.sendRequest(command) : this.connection.sendRequest(command, args);
  }

  sendNotification<K extends keyof NeoNotificationTypes>(command: K, args: NeoNotificationTypes[K][0]) {
    return args === undefined ? this.connection.sendNotification(command) : this.connection.sendNotification(command, args);
  }

  onNotification<K extends keyof NeoOnNotificationTypes>(kind: K, listener: (args: NeoOnNotificationTypes[K]) => unknown): Disposable {
    return this.connection.onNotification(kind, listener);
  }

  onRequest<K extends keyof NeoOnRequestTypes>(kind: K, listener: (args: NeoOnRequestTypes[K][0]) => NeoOnRequestTypes[K][1]): Disposable {
    return this.connection.onRequest(kind, listener);
  }

  public static async startClient(connection: Connection): Promise<NeoClient> {
    const messageConnection = createMessageConnection(connection.reader, connection.writer);
    const client = new NeoClientJsonRpc(messageConnection);
    client.start();
    connection.reader.onClose(() => client.stop());
    return client;
  }
}
