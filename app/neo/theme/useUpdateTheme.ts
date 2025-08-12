import { useTheme } from '@axonivy/ui-components';
import { type RefObject, useEffect } from 'react';

export const useUpdateTheme = (
  frame: RefObject<HTMLIFrameElement | null>,
  updateFrameTheme: (frame: RefObject<HTMLIFrameElement | null>, theme: string) => void
) => {
  const { realTheme } = useTheme();
  useEffect(() => {
    updateFrameTheme(frame, realTheme);
  }, [frame, realTheme, updateFrameTheme]);
};
