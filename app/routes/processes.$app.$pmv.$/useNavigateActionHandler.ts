import { useCallback } from 'react';
import { editorOfPath, useEditors } from '~/neo/useEditors';
import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol/lib/action-protocol/element-navigation';

const asString = (argValue?: string | number | boolean): string | undefined => {
  return typeof argValue === 'string' ? argValue : undefined;
};

export const useNavigateActionHandler = (app: string) => {
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
