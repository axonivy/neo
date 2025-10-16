import { useTheme } from '@axonivy/ui-components';
import { type RefObject, useEffect } from 'react';

export const useUpdateTheme = (
  frameRef: RefObject<HTMLIFrameElement | null>,
  updateFrameTheme: (frame: HTMLIFrameElement | null, theme: string) => void
) => {
  const { realTheme } = useTheme();
  useEffect(() => {
    updateFrameTheme(frameRef.current, realTheme);
  }, [frameRef, realTheme, updateFrameTheme]);
};
