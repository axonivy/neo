import { WebSocketMessageReader, WebSocketMessageWriter, wrap, type Connection, type Message } from '@axonivy/jsonrpc';

export async function createWebSocketConnection(url: string | URL): Promise<Connection> {
  return new Promise<Connection>((resolve, reject) => {
    const webSocket = new WebSocket(url);
    webSocket.onopen = async () => {
      const socket = wrap(webSocket);
      const reader = new IvyWebSocketMessageReader(socket);
      const writer = new IvyWebSocketMessageWriter(socket);
      const connection: Connection = { reader, writer };
      forwardClientMessages(reader);
      resolve(connection);
    };
    webSocket.onerror = () => reject('Connection could not be established.');
  });
}

const forwardClientMessages = (reader: IvyWebSocketMessageReader) => {
  window.addEventListener('message', event => {
    reader.handleMessage(JSON.stringify(event.data));
  });
};

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

class IvyWebSocketMessageReader extends WebSocketMessageReader {
  handleMessage(message: unknown): void {
    super.handleMessage(message);
  }
}

const isAction = (obj: unknown): obj is { method: string } => {
  return typeof obj === 'object' && obj !== null && 'method' in obj && obj.method === 'action';
};
