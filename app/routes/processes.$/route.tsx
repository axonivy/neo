import type { MetaFunction } from '@remix-run/node';
import { useHref, useParams } from '@remix-run/react';
import { useRef } from 'react';
import { useRestoreEditor } from '~/neo/useEditors';
import { updateFrameTheme, useThemeMode, useUpdateTheme } from './useUpdateTheme';
import { useNavigateAction } from './useNavigateAction';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Process' }, { name: 'description', content: 'Axon Ivy Process' }];
};

export default function Index() {
  const param = useParams();
  useRestoreEditor('processes', param['*']);
  const editorUrl = useHref(`/process-editor/index.html?app=designer&pmv=workflow-demos&file=/processes/${param['*']}.p.json`);
  const frame = useRef<HTMLIFrameElement>(null);
  useNavigateAction(frame);
  useUpdateTheme(frame);
  const theme = useThemeMode();
  return (
    <iframe
      ref={frame}
      key={param['*']}
      title='process'
      src={editorUrl}
      style={{ width: '100%', height: '100%', border: 'none' }}
      onLoad={() => updateFrameTheme(frame, theme)}
    />
  );
}
