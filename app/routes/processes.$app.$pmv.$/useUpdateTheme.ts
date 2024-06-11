import { useTheme } from '@axonivy/ui-components';
import { RefObject, useEffect } from 'react';

export const useThemeMode = () => {
  const { theme } = useTheme();
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

export const updateFrameTheme = (frame: RefObject<HTMLIFrameElement>, theme: string) => {
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

export const useUpdateTheme = (frame: RefObject<HTMLIFrameElement>) => {
  const theme = useThemeMode();
  useEffect(() => {
    updateFrameTheme(frame, theme);
  }, [frame, theme]);
};
