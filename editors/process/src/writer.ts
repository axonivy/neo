import { Connection } from '@axonivy/jsonrpc';
import { AbstractMessageWriter, MessageWriter, Message } from 'vscode-jsonrpc';
import { IWebSocket, WebSocketMessageReader, toSocket } from 'vscode-ws-jsonrpc';

export async function createWebSocketConnection(url: string | URL): Promise<Connection> {
  return new Promise<Connection>((resolve, reject) => {
    const webSocket = new WebSocket(url);
    webSocket.onopen = async () => {
      const socket = toSocket(webSocket);
      const reader = new WebSocketMessageReader(socket);
      const writer = new WebSocketMessageWriter(socket);
      const connection: Connection = { reader, writer };
      resolve(connection);
    };
    webSocket.onerror = () => reject('Connection could not be established.');
  });
}
export class WebSocketMessageWriter extends AbstractMessageWriter implements MessageWriter {
  protected errorCount = 0;
  protected readonly socket: IWebSocket;

  constructor(socket: IWebSocket) {
    super();
    this.socket = socket;
  }

  end(): void {}

  async write(msg: Message): Promise<void> {
    try {
      const content = JSON.stringify(msg);
      console.log(content);
      this.socket.send(content);
    } catch (e) {
      this.errorCount++;
      this.fireError(e, msg, this.errorCount);
    }
  }
}
