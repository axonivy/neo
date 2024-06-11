import { useEffect, useRef, useState } from 'react';
import { updateFrameTheme, useThemeMode, useUpdateTheme } from './useUpdateTheme';
import { useHref, useLocation } from '@remix-run/react';
import { useNavigateAction } from './useNavigateAction';
import { Editor } from '~/neo/useEditors';

export const ProcessEditor = ({ id, app, pmv, path }: Editor) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const theme = useThemeMode();
  const editorUrl = useHref(`/process-editor/index.html?app=${app}&pmv=${pmv}&file=/processes/${path}.p.json`);
  const { pathname } = useLocation();
  useNavigateAction(frame, app);
  useUpdateTheme(frame);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (pathname === id) {
      setMounted(true);
    }
  }, [pathname, id]);
  return (
    <>
      {mounted && (
        <iframe
          ref={frame}
          title='process'
          src={editorUrl}
          style={{ width: '100%', height: '100%', border: 'none', display: pathname !== id ? 'none' : undefined }}
          onLoad={() => updateFrameTheme(frame, theme)}
        />
      )}
    </>
  );
};
