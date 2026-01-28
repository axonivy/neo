import { type RefObject, useEffect } from 'react';
import { useActionHandler } from './useInscriptionActionHandler';
import { useNavigateActionHandler } from './useNavigationActionHandler';
import { useStartActionHandler } from './useStartActionHandler';

export const useFrameMessageHandler = (frame: RefObject<HTMLIFrameElement | null>, app: string) => {
  const navigationHandler = useNavigateActionHandler(app);
  const startHandler = useStartActionHandler();
  const actionHandler = useActionHandler();
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      const contentWindow = frame.current?.contentWindow;
      if (contentWindow !== event.source) {
        return;
      }
      const data = JSON.parse(event.data);
      navigationHandler(data);
      startHandler(data);
      actionHandler(data, contentWindow);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [frame, navigationHandler, startHandler, actionHandler]);
};
