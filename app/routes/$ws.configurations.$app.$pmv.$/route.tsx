import editorStylesHref from '@axonivy/variable-editor/lib/style.css?url';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { editorMetaFunctionProvider } from '~/metaFunctionProvider';
import { useRestoreEditor } from '~/neo/editors/useRestoreEditor';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: editorStylesHref }];

export const meta: MetaFunction = editorMetaFunctionProvider('Axon Ivy Configuration Editor');

export default function Index() {
  useRestoreEditor('configurations');
  return <></>;
}
