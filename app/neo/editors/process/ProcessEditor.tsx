import { RefObject, useEffect, useRef, useState } from 'react';
import { useHref, useLocation } from '@remix-run/react';
import { Editor } from '~/neo/editors/useEditors';
import { useThemeMode, useUpdateTheme } from '~/theme/useUpdateTheme';
import { useFrameMessageHandler } from './message/useFrameMessageHandler';

const updateFrameTheme = (frame: RefObject<HTMLIFrameElement>, theme: string) => {
  const frameRoot = frame.current?.contentWindow?.document.documentElement;
  if (frameRoot) {
    frameRoot.classList.remove('light', 'dark');
    frameRoot.classList.add(theme);
    frameRoot.dataset.theme = theme;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const monaco = frame.current?.contentWindow?.setMonacoTheme;
    if (monaco) {
      monaco(theme);
    }
  }
};

export const ProcessEditor = ({ id, project, type, path }: Editor) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const theme = useThemeMode();
  const editorUrl = useHref(`/process-editor/index.html?app=${project.app}&pmv=${project.pmv}&file=/${type}/${path}.p.json`);
  const { pathname } = useLocation();
  useFrameMessageHandler(frame, project.app);
  useUpdateTheme(frame, updateFrameTheme);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    if (pathname === id) {
      setMounted(true);
      // trigger rerender of process to fix invisible connectors
      frame.current?.contentWindow?.dispatchEvent(new CustomEvent('resize'));
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
