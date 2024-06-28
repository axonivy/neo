import { useCallback } from 'react';
import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol/lib/action-protocol/element-navigation';
import { EditorType, createEditorFromPath, useEditors } from '~/neo/editors/useEditors';
import { useParams } from '@remix-run/react';

const asString = (argValue?: string | number | boolean): string | undefined => {
  return typeof argValue === 'string' ? argValue : undefined;
};

export const useNavigateActionHandler = (app: string) => {
  const { openEditor } = useEditors();
  const ws = useParams().ws ?? 'designer';
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
        openEditor(createEditorFromPath(ws, type, { app, pmv }, process));
      }
    },
    [openEditor, ws, app]
  );
};
