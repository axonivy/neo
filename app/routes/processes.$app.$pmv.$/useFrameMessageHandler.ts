import { RefObject, useEffect } from 'react';
import { useStartActionHandler } from './useStartActionHandler';
import { useNavigateActionHandler } from './useNavigateActionHandler';
import { useNewProcessActionHandler } from './useNewProcessActionHandler';

export function hasStringProp(object: Record<string, string>, propertyKey: string, optional = false): boolean {
  const property = object[propertyKey];
  return property !== undefined ? typeof property === 'string' : optional;
}

export const useFrameMessageHandler = (frame: RefObject<HTMLIFrameElement>, app: string) => {
  const navigationHandler = useNavigateActionHandler(app);
  const startHandler = useStartActionHandler();
  const newProcessHandler = useNewProcessActionHandler();
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (frame.current?.contentWindow !== event.source) {
        return;
      }
      const data = JSON.parse(event.data);
      navigationHandler(data);
      startHandler(data);
      newProcessHandler(data);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [frame, navigationHandler, startHandler, newProcessHandler]);
};
