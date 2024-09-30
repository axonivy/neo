import editorStylesHref from '@axonivy/variable-editor/lib/style.css?url';
import type { MetaFunction } from '@remix-run/node';
import { LinksFunction } from '@remix-run/node';
import { useRestoreEditor } from '~/neo/editors/useRestoreEditor';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: editorStylesHref }];

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Configurations' }, { name: 'description', content: 'Axon Ivy Configurations' }];
};

export default function Index() {
  useRestoreEditor('configurations');
  return <></>;
}
