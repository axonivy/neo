import { useTheme } from '@axonivy/ui-components';
import { type RefObject, useEffect } from 'react';

export const useThemeMode = () => {
  const { theme } = useTheme();
  if (theme === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return theme;
};

export const useUpdateTheme = (
  frame: RefObject<HTMLIFrameElement>,
  updateFrameTheme: (frame: RefObject<HTMLIFrameElement>, theme: string) => void
) => {
  const theme = useThemeMode();
  useEffect(() => {
    updateFrameTheme(frame, theme);
  }, [frame, theme, updateFrameTheme]);
};
