import { BaseRpcClient, type Disposable, type MessageConnection, urlBuilder } from '@axonivy/jsonrpc';
import type { AnimationFollowMode } from '~/neo/settings/useSettings';
import type { Form } from './form-api';
import { Callback, type NeoClient } from './neo-protocol';
import type { Process } from './process-api';

export interface NeoOnRequestTypes {
  openProcessEditor: [Process, Promise<boolean>];
  openFormEditor: [Form, Promise<boolean>];
}

export type AnimationSettings = {
  animate: boolean;
  speed: number;
  mode: AnimationFollowMode;
};

export interface NeoNotificationTypes {
  animationSettings: [AnimationSettings];
}

export class NeoClientJsonRpc extends BaseRpcClient implements NeoClient {
  onOpenProcessEditor = new Callback<Process, boolean>();
  onOpenFormEditor = new Callback<Form, boolean>();
  protected override setupConnection(): void {
    super.setupConnection();
    this.toDispose.push(this.onOpenProcessEditor);
    this.toDispose.push(this.onOpenFormEditor);
    this.onRequest('openProcessEditor', data => this.onOpenProcessEditor.call(data) ?? new Promise(() => false));
    this.onRequest('openFormEditor', data => this.onOpenFormEditor.call(data) ?? new Promise(() => false));
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
