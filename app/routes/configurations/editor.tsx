import cmsEditorStylesHref2 from '@axonivy/cms-editor/lib/editor.css?url';
import variableEditorStylesHref from '@axonivy/variable-editor/lib/editor.css?url';
import { type LinksFunction, type MetaFunction } from 'react-router';
import { editorMetaFunctionProvider } from '~/metaFunctionProvider';
import { useRestoreEditor } from '~/neo/editors/useRestoreEditor';

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: cmsEditorStylesHref2 },
  { rel: 'stylesheet', href: variableEditorStylesHref }
];

export const meta: MetaFunction = editorMetaFunctionProvider('Axon Ivy Configuration Editor');

export default function Index() {
  useRestoreEditor();
  return <></>;
}
