import cmsEditorStylesHref from '@axonivy/cms-editor/lib/editor.css?url';
import roleEditorStylesHref from '@axonivy/role-editor/lib/editor.css?url';
import variableEditorStylesHref from '@axonivy/variable-editor/lib/editor.css?url';
import { type LinksFunction, type MetaFunction } from 'react-router';
import { editorMetaFunctionProvider } from '~/metaFunctionProvider';
import { useRestoreEditor } from '~/neo/editors/useRestoreEditor';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: cmsEditorStylesHref },
  { rel: 'stylesheet', href: variableEditorStylesHref },
  { rel: 'stylesheet', href: roleEditorStylesHref }
];

export const meta: MetaFunction = editorMetaFunctionProvider('Axon Ivy Configuration Editor');

export default function Index() {
  useRestoreEditor();
  return <></>;
}
