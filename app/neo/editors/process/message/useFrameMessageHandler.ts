import { RefObject, useEffect } from 'react';
import { useStartActionHandler } from './useStartActionHandler';
import { useNewFormActionHandler, useNewProcessActionHandler } from './useInscriptionActionHandler';
import { useNavigateActionHandler } from './useNavigationActionHandler';

export const useFrameMessageHandler = (frame: RefObject<HTMLIFrameElement>, app: string) => {
  const navigationHandler = useNavigateActionHandler(app);
  const startHandler = useStartActionHandler();
  const newProcessHandler = useNewProcessActionHandler();
  const newFormHandler = useNewFormActionHandler();
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const contentWindow = frame.current?.contentWindow;
      if (contentWindow !== event.source) {
        return;
      }
      const data = JSON.parse(event.data);
      navigationHandler(data);
      startHandler(data);
      newProcessHandler(data, contentWindow);
      newFormHandler(data, contentWindow);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [frame, navigationHandler, startHandler, newProcessHandler, newFormHandler]);
};
