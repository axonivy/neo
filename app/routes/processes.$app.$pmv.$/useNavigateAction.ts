import { RefObject, useEffect } from 'react';
import { editorOfPath, useEditors } from '~/neo/useEditors';

const isNavigateData = (obj: unknown): obj is { uri: string; args: { pmv: string } } => {
  return typeof obj === 'object' && obj !== null && 'uri' in obj;
};

export const useNavigateAction = (frame: RefObject<HTMLIFrameElement>, app: string) => {
  const { openEditor } = useEditors();
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (frame.current?.contentWindow !== event.source) {
        return;
      }
      const data = JSON.parse(event.data);
      if (!isNavigateData(data)) {
        return;
      }
      const process = data.uri.split('/processes/')[1];
      if (process) {
        const endIndex = process.lastIndexOf('.p.json');
        const editor = editorOfPath('processes', app, data.args.pmv, process.substring(0, endIndex));
        openEditor(editor);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [frame, openEditor]);
};
