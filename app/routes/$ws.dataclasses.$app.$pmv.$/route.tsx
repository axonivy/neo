import editorStylesHref from '@axonivy/dataclass-editor/lib/style.css?url';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { editorMetaFunctionProvider } from '~/metaFunctionProvider';
import { useRestoreEditor } from '~/neo/editors/useRestoreEditor';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: editorStylesHref }];

export const meta: MetaFunction = editorMetaFunctionProvider('Axon Ivy Data Class Editor');

export default function Index() {
  useRestoreEditor('dataclasses');
  return <></>;
}
