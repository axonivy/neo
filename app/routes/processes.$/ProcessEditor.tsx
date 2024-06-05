import { useEffect, useRef, useState } from 'react';
import { updateFrameTheme, useThemeMode, useUpdateTheme } from './useUpdateTheme';
import { useHref, useLocation } from '@remix-run/react';
import { useNavigateAction } from './useNavigateAction';

export const ProcessEditor = ({ url }: { url: string }) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const theme = useThemeMode();
  const editorUrl = useHref(`/process-editor/index.html?app=designer&pmv=workflow-demos&file=${url}.p.json`);
  const { pathname } = useLocation();
  useNavigateAction(frame);
  useUpdateTheme(frame);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (pathname === url) {
      setMounted(true);
    }
  }, [pathname, url]);
  return (
    <>
      {mounted && (
        <iframe
          ref={frame}
          title='process'
          src={editorUrl}
          style={{ width: '100%', height: '100%', border: 'none', display: pathname !== url ? 'none' : undefined }}
          onLoad={() => updateFrameTheme(frame, theme)}
        />
      )}
    </>
  );
};
