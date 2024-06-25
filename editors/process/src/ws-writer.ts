import { Connection } from '@axonivy/jsonrpc';
import { Message } from 'vscode-jsonrpc';
import { WebSocketMessageReader, WebSocketMessageWriter, toSocket } from 'vscode-ws-jsonrpc';

export async function createWebSocketConnection(url: string | URL): Promise<Connection> {
  return new Promise<Connection>((resolve, reject) => {
    const webSocket = new WebSocket(url);
    webSocket.onopen = async () => {
      const socket = toSocket(webSocket);
      const reader = new WebSocketMessageReader(socket);
      const writer = new IvyWebSocketMessageWriter(socket);
      const connection: Connection = { reader, writer };
      resolve(connection);
    };
    webSocket.onerror = () => reject('Connection could not be established.');
  });
}

export class IvyWebSocketMessageWriter extends WebSocketMessageWriter {
  override async write(msg: Message): Promise<void> {
    try {
      const content = JSON.stringify(msg);
      this.socket.send(content);
      window.parent.postMessage(content);
    } catch (e) {
      this.errorCount++;
      this.fireError(e, msg, this.errorCount);
    }
  }
}
