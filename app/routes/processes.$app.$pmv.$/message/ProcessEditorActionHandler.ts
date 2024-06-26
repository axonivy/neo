import { useCallback } from 'react';
import { useWebBrowser } from '~/neo/browser/useWebBrowser';
import { Action } from '@eclipse-glsp/protocol/lib/action-protocol/base-protocol';
import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol/lib/action-protocol/element-navigation';
import { EditorType, editorOfPath, useEditors } from '~/neo/useEditors';

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

const asString = (argValue?: string | number | boolean): string | undefined => {
  return typeof argValue === 'string' ? argValue : undefined;
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

export const useNavigateActionHandler = (app: string) => {
  const { openEditor } = useEditors();
  return useCallback(
    (data: unknown) => {
      if (!NavigateToExternalTargetAction.is(data)) {
        return;
      }
      const { uri, args } = data.target;
      const pmv = asString(args?.pmv)?.split('$')[0];
      let process = uri.split('/processes/')[1];
      let type: EditorType = 'processes';
      if (!process) {
        process = uri.split('/src_hd/')[1];
        type = 'src_hd';
      }
      if (process && pmv) {
        const endIndex = process.lastIndexOf('.p.json');
        const editor = editorOfPath(type, { app, pmv }, process.substring(0, endIndex));
        openEditor(editor);
      }
    },
    [openEditor, app]
  );
};
