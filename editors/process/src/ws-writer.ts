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

class IvyWebSocketMessageWriter extends WebSocketMessageWriter {
  override async write(msg: Message): Promise<void> {
    try {
      const content = JSON.stringify(msg);
      if (isAction(msg)) {
        window.parent.postMessage(content);
        return;
      }
      this.socket.send(content);
    } catch (e) {
      this.errorCount++;
      this.fireError(e, msg, this.errorCount);
    }
  }
}

const isAction = (obj: unknown): obj is { method: string } => {
  return typeof obj === 'object' && obj !== null && 'method' in obj && obj.method === 'action';
};
