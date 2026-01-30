import type { FormActionArgs } from '@axonivy/form-editor-protocol';
import { useCallback } from 'react';
import { useComponentForm } from '~/data/form-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { useOpenUrl } from '~/neo/browser/useOpenUrl';
import { DIALOG_DATA_EDITOR_SUFFIX, DIALOG_PROCESS_EDITOR_SUFFIX } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { noUnknownAction } from '~/utils/no-unknown-action';
import type { FormActionHandler } from './form-client';

const editorPath = (action: FormActionArgs, formEditorPath: string) => {
  switch (action.actionId) {
    case 'openDataClass':
      return `${formEditorPath}${DIALOG_DATA_EDITOR_SUFFIX}`;
    case 'openProcess':
      return `${formEditorPath}${DIALOG_PROCESS_EDITOR_SUFFIX}`;
  }
  return formEditorPath;
};

export const useActionHandler = (project: ProjectIdentifier, formEditorPath: string) => {
  const { openEditor } = useEditors();
  const { createEditorFromPath, createFormEditor } = useCreateEditor();
  const { getComponentForm } = useComponentForm();
  const openUrl = useOpenUrl();
  return useCallback<FormActionHandler>(
    action => {
      switch (action.actionId) {
        case 'openUrl':
        case 'openPreview':
          openUrl(action.payload);
          return;
        case 'openComponent':
          getComponentForm({ componentId: action.payload, app: project.app, pmv: project.pmv })
            .unwrap()
            .then(form => {
              openEditor(createFormEditor(form));
            });
          return;
        case 'openProcess':
        case 'openDataClass':
          openEditor(createEditorFromPath(project, editorPath(action, formEditorPath)));
          return;
        default:
          noUnknownAction(action.actionId);
      }
    },
    [createEditorFromPath, createFormEditor, formEditorPath, getComponentForm, openEditor, openUrl, project]
  );
};
