import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol/lib/action-protocol/element-navigation';
import { useCallback } from 'react';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { removeFirstSegmet } from '~/utils/path';

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
      if (!pmv || !uri) {
        return;
      }
      const path = removeFirstSegmet(uri);
      const isIar = asString(args?.isIar) === 'true';
      openEditor(createEditorFromPath({ app, pmv, isIar }, path));
    },
    [openEditor, createEditorFromPath, app]
  );
};
