import { useCallback } from 'react';
import { useWebBrowser } from '~/neo/browser/useWebBrowser';
import { Action } from '@eclipse-glsp/protocol/lib/action-protocol/base-protocol';

interface StartProcessAction extends Action {
  kind: 'startProcess';
  elementId: string;
  processStartUri: string;
}

function hasStringProp(object: Record<string, string>, propertyKey: string, optional = false): boolean {
  const property = object[propertyKey];
  return property !== undefined ? typeof property === 'string' : optional;
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
