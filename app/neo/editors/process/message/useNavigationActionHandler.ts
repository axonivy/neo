import { NavigateToExternalTargetAction } from '@eclipse-glsp/protocol/lib/action-protocol/element-navigation';
import { useCallback } from 'react';
import { useCreateEditor, useEditors } from '~/neo/editors/useEditors';

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
      if (!pmv) {
        return;
      }
      const path = removeFirstSegmet(uri);
      const isIar = asString(args?.isIar) === 'true';
      if (path && pmv) {
        openEditor(createEditorFromPath({ app, pmv, isIar }, path));
      }
    },
    [openEditor, createEditorFromPath, app]
  );
};

const removeFirstSegmet = (uri: string) => {
  let path = uri;
  if (path.startsWith('/')) {
    path = path.substring(1);
  }
  return path.substring(path.indexOf('/') + 1);
};
