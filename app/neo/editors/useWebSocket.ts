import { Connection, createMessageConnection, MessageConnection, RpcClient, webSocketConnection } from '@axonivy/jsonrpc';
import { useEffect, useRef, useState } from 'react';
import type { Logger } from 'vscode-jsonrpc';
import { useWorkspace } from '~/data/workspace-api';
import { wsBaseUrl } from '~/data/ws-base';

export const useWebSocket = <TClient extends RpcClient>(
  id: string,
  urlBuilder: (url: string) => string,
  startClient: (connection: MessageConnection) => Promise<TClient>,
  logger?: Logger
) => {
  const [client, setClient] = useState<TClient>();
  const initialized = useRef<boolean>();
  const ws = useWorkspace();
  useEffect(() => {
    if (ws?.baseUrl === undefined || initialized.current) return;
    initialized.current = true;
    const webSocketUrl = urlBuilder(`${wsBaseUrl()}${ws.baseUrl}`);
    const initClient = async (connection: Connection) => {
      const rpcClient = await startClient(createMessageConnection(connection.reader, connection.writer));
      setClient(rpcClient);
      return rpcClient;
    };
    const reconnectClient = async (connection: Connection, oldClient: TClient) => {
      await oldClient.stop();
      return initClient(connection);
    };
    webSocketConnection<TClient>(webSocketUrl).listen({
      onConnection: initClient,
      onReconnect: reconnectClient,
      logger: logger ?? console
    });
  }, [id, logger, startClient, urlBuilder, ws?.baseUrl]);
  return client;
};
