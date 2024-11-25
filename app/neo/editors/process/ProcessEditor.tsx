import { useHref, useLocation } from 'react-router';
import { type RefObject, useEffect, useRef, useState } from 'react';
import { useWorkspace } from '~/data/workspace-api';
import { baseUrl } from '~/data/ws-base';
import { useThemeMode, useUpdateTheme } from '~/theme/useUpdateTheme';
import { type Editor, PROCESS_EDITOR_SUFFIX } from '../editor';
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

export const ProcessEditor = ({ id, project, path, name }: Editor) => {
  const frame = useRef<HTMLIFrameElement>(null);
  const theme = useThemeMode();
  const ws = useWorkspace();
  const editorUrl = useHref(
    `/process-editor/index.html?server=${`${baseUrl()}${ws?.baseUrl}`}&app=${project.app}&pmv=${project.pmv}&file=/${path}${PROCESS_EDITOR_SUFFIX}&readonly=${project.isIar ?? false}`
  );
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
          title={name}
          src={editorUrl}
          style={{ width: '100%', height: '100%', border: 'none', display: pathname !== id ? 'none' : undefined }}
          onLoad={() => updateFrameTheme(frame, theme)}
        />
      )}
    </>
  );
};
