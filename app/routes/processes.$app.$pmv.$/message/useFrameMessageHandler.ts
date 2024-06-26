import { RefObject, useEffect } from 'react';
import { useNavigateActionHandler, useStartActionHandler } from './ProcessEditorActionHandler';
import { useNewFormActionHandler, useNewProcessActionHandler } from './InscriptionViewActionHandler';

export const useFrameMessageHandler = (frame: RefObject<HTMLIFrameElement>, app: string) => {
  const navigationHandler = useNavigateActionHandler(app);
  const startHandler = useStartActionHandler();
  const newProcessHandler = useNewProcessActionHandler();
  const newFormHandler = useNewFormActionHandler();
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (frame.current?.contentWindow !== event.source) {
        return;
      }
      const data = JSON.parse(event.data);
      navigationHandler(data);
      startHandler(data);
      newProcessHandler(data);
      newFormHandler(data);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [frame, navigationHandler, startHandler, newProcessHandler, newFormHandler]);
};
