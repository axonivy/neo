import editorStylesHref from '@axonivy/dataclass-editor/lib/style.css?url';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useRestoreEditor } from '~/neo/editors/useRestoreEditor';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: editorStylesHref }];

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Data Classes' }, { name: 'description', content: 'Axon Ivy Data Classes' }];
};

export default function Index() {
  useRestoreEditor('dataclasses');
  return <></>;
}
