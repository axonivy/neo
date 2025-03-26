import i18next from 'i18next';
import { useCallback, useEffect, type RefObject } from 'react';

export const useUpdateLanguage = (
  frame: RefObject<HTMLIFrameElement | null>,
  callback: (frame: RefObject<HTMLIFrameElement | null>, theme: string) => void
) => {
  const updateLanguage = useCallback((lng: string) => callback(frame, lng), [callback, frame]);
  useEffect(() => {
    i18next.on('languageChanged', updateLanguage);
    return () => {
      i18next.off('languageChanged', updateLanguage);
    };
  }, [frame, updateLanguage]);
};
