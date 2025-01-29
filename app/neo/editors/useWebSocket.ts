import { type Connection, createMessageConnection, type MessageConnection, type RpcClient, webSocketConnection } from '@axonivy/jsonrpc';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { Logger } from 'vscode-jsonrpc';
import { useWorkspace } from '~/data/workspace-api';
import { wsBaseUrl } from '~/data/ws-base';

export const useWebSocket = <TClient extends RpcClient>(
  urlBuilder: (url: string) => string,
  startClient: (connection: MessageConnection) => Promise<TClient>,
  logger?: Logger
) => {
  const [client, setClient] = useState<TClient>();
  const abortController = useMemo(() => new AbortController(), []);
  const initialized = useRef<boolean>(false);
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

    webSocketConnection<TClient>(webSocketUrl, { abortSignal: abortController.signal }).listen({
      onConnection: initClient,
      onReconnect: reconnectClient,
      logger: logger ?? console
    });
  }, [abortController.signal, logger, startClient, urlBuilder, ws?.baseUrl]);
  useEffect(() => {
    return () => {
      if (client) {
        abortController.abort();
      }
    };
  }, [abortController, client]);
  return client;
};
