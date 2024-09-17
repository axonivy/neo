import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol/lib/action-protocol/element-navigation';
import { useCallback } from 'react';
import { EditorType, useCreateEditor, useEditors } from '~/neo/editors/useEditors';

const asString = (argValue?: string | number | boolean): string | undefined => {
  return typeof argValue === 'string' ? argValue : undefined;
};

export const useNavigateActionHandler = (app: string) => {
  const { openEditor } = useEditors();
  const { createEditorFromPath } = useCreateEditor();
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
      const isIar = asString(args?.isIar) === 'true';
      if (process && pmv) {
        openEditor(createEditorFromPath(type, { app, pmv, isIar }, process));
      }
    },
    [openEditor, createEditorFromPath, app]
  );
};
