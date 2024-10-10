import { BaseRpcClient, type Disposable, type MessageConnection, urlBuilder } from '@axonivy/jsonrpc';
import { Callback, type NeoClient } from './neo-protocol';
import type { Process } from './process-api';

export interface NeoOnRequestTypes {
  openEditor: [Process, boolean];
}

export type AnimationSettings = {
  animate: boolean;
  speed: number;
};

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

  sendNotification<K extends keyof NeoNotificationTypes>(command: K, args: NeoNotificationTypes[K][0]) {
    return args === undefined ? this.connection.sendNotification(command) : this.connection.sendNotification(command, args);
  }

  onRequest<K extends keyof NeoOnRequestTypes>(kind: K, listener: (args: NeoOnRequestTypes[K][0]) => NeoOnRequestTypes[K][1]): Disposable {
    return this.connection.onRequest(kind, listener);
  }

  public static webSocketUrl(url: string) {
    return urlBuilder(url, 'ivy-web-ide-lsp');
  }

  public static async startMessageClient(connection: MessageConnection): Promise<NeoClientJsonRpc> {
    const client = new NeoClientJsonRpc(connection);
    await client.start();
    return client;
  }
}
