import { RefObject, useCallback, useEffect } from 'react';
import { editorOfPath, useEditors } from '~/neo/useEditors';
import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol/lib/action-protocol/element-navigation';
import { Action } from '@eclipse-glsp/protocol/lib/action-protocol/base-protocol';
import { useWebBrowser } from '~/neo/browser/useWebBrowser';

const asString = (argValue?: string | number | boolean): string | undefined => {
  return typeof argValue === 'string' ? argValue : undefined;
};

export function hasStringProp(object: Record<string, string>, propertyKey: string, optional = false): boolean {
  const property = object[propertyKey];
  return property !== undefined ? typeof property === 'string' : optional;
}

export interface StartProcessAction extends Action {
  kind: 'startProcess';
  elementId: string;
  processStartUri: string;
}

const isStartProcessAction = (object: unknown): object is StartProcessAction => {
  return Action.hasKind(object, 'startProcess') && hasStringProp(object, 'elementId') && hasStringProp(object, 'processStartUri');
};

const useNavigateActionHandler = (app: string) => {
  const { openEditor } = useEditors();
  return useCallback(
    (data: unknown) => {
      if (!NavigateToExternalTargetAction.is(data)) {
        return;
      }
      const { uri, args } = data.target;
      const pmv = asString(args?.pmv);
      const process = uri.split('/processes/')[1];
      if (process && pmv) {
        const endIndex = process.lastIndexOf('.p.json');
        const editor = editorOfPath('processes', { app, pmv }, process.substring(0, endIndex));
        openEditor(editor);
      }
    },
    [openEditor, app]
  );
};

const useStartActionHandler = () => {
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

export const useFrameMessageHandler = (frame: RefObject<HTMLIFrameElement>, app: string) => {
  const navigationHandler = useNavigateActionHandler(app);
  const startHandler = useStartActionHandler();
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (frame.current?.contentWindow !== event.source) {
        return;
      }
      const data = JSON.parse(event.data);
      navigationHandler(data);
      startHandler(data);
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [frame, navigationHandler, startHandler]);
};
