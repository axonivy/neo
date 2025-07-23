import { Action } from '@eclipse-glsp/protocol/lib/action-protocol/base-protocol';
import { useCallback } from 'react';
import { useSidePanel } from '~/neo/workspace/useSidePanel';

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
  const { sidePanel } = useSidePanel();
  return useCallback(
    (data: unknown) => {
      if (!isStartProcessAction(data)) {
        return;
      }
      sidePanel.openUrl(data.processStartUri);
    },
    [sidePanel]
  );
};
