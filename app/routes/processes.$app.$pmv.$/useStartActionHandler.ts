import { useCallback } from 'react';
import { useWebBrowser } from '~/neo/browser/useWebBrowser';
import { hasStringProp } from './useFrameMessageHandler';
import { Action } from '@eclipse-glsp/protocol/lib/action-protocol/base-protocol';

interface StartProcessAction extends Action {
  kind: 'startProcess';
  elementId: string;
  processStartUri: string;
}

const isStartProcessAction = (object: unknown): object is StartProcessAction => {
  return Action.hasKind(object, 'startProcess') && hasStringProp(object, 'elementId') && hasStringProp(object, 'processStartUri');
};

export const useStartActionHandler = () => {
  const { browser } = useWebBrowser();
  return useCallback(
    (data: unknown) => {
      if (!isStartProcessAction(data)) {
        return;
      }
      browser.open(data.processStartUri);
    },
    [browser]
  );
};
