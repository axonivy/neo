import type { MetaFunction } from '@remix-run/node';
import { useHref, useParams } from '@remix-run/react';
import { useEffect, useRef } from 'react';
import { editorOfPath, useEditors, useRestoreEditor } from '~/neo/useEditors';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Process' }, { name: 'description', content: 'Axon Ivy Process' }];
};

const isNavigateData = (obj: unknown): obj is { uri: string } => {
  return typeof obj === 'object' && obj !== null && 'uri' in obj;
};

export default function Index() {
  const param = useParams();
  useRestoreEditor('processes', param['*']);
  const editorUrl = useHref(
    `/process-editor/index.html?server=localhost:8081&app=designer&pmv=workflow-demos&file=/processes/${param['*']}.p.json`
  );
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
        const editor = editorOfPath('processes', process.substring(0, endIndex));
        openEditor(editor);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [openEditor]);
  const frame = useRef<HTMLIFrameElement>(null);
  return <iframe ref={frame} key={param['*']} title='process' src={editorUrl} style={{ width: '100%', height: '100%', border: 'none' }} />;
}
