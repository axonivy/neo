import { useTheme } from '@axonivy/ui-components';
import { useEffect, useRef } from 'react';
import { useHref, useLocation } from 'react-router';
import { appToBaseUrl } from '~/data/workspace-api';
import { baseUrl } from '~/data/ws-base';
import { type Editor, PROCESS_EDITOR_SUFFIX } from '~/neo/editors/editor';
import { useUpdateTheme } from '~/neo/theme/useUpdateTheme';
import { useUpdateLanguage } from '~/translation/useUpdateLanguage';
import { useHotkeyDispatcher } from '~/utils/hotkeys';
import { useFrameMessageHandler } from './message/useFrameMessageHandler';

const updateFrameTheme = (frame: HTMLIFrameElement | null, theme: string) => {
  const frameRoot = frame?.contentWindow?.document.documentElement;
  if (frameRoot) {
    frameRoot.classList.remove('light', 'dark');
    frameRoot.classList.add(theme);
    frameRoot.dataset.theme = theme;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const monaco = frame?.contentWindow?.setMonacoTheme;
    if (monaco) {
      monaco(theme);
    }
  }
};

export const ProcessEditor = ({ id, project, path, name }: Editor) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  useHotkeyDispatcher(frameRef);
  const { realTheme } = useTheme();
  // Derive baseUrl from project.app (already available as prop) to avoid waiting for the workspaces API
  const wsBaseUrl = appToBaseUrl(project.app);
  const editorUrl = useHref(
    `/process-editor/index.html?server=${`${baseUrl()}${wsBaseUrl}`}&app=${project.app}&pmv=${project.pmv}&file=${path}${PROCESS_EDITOR_SUFFIX}&readonly=${project.isIar ?? false}`
  );
  const { pathname } = useLocation();
  useFrameMessageHandler(frameRef, project.app);
  useUpdateTheme(frameRef, updateFrameTheme);
  useUpdateLanguage(frameRef, frame => frame.current?.contentWindow?.location.reload());
  useEffect(() => {
    if (pathname === id) {
      // trigger rerender of process to fix invisible connectors
      frameRef.current?.contentWindow?.dispatchEvent(new CustomEvent('resize'));
    }
  }, [pathname, id]);
  // Skipping useWorkspace() guard here as it would block iframe rendering until the API responds, negating the baseUrl optimization.
  // If the workspace is invalid, the iframe will fail to connect as before.
  // const ws = useWorkspace();
  // if (!ws) { return null; }
  return (
    <iframe
      ref={frameRef}
      title={name}
      src={editorUrl}
      style={{ width: '100%', height: 'calc(100% - 24px)', border: 'none' }}
      onLoad={() => updateFrameTheme(frameRef.current, realTheme)}
    />
  );
};
