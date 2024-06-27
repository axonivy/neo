import type { MetaFunction } from '@remix-run/node';
import { useRestoreEditor } from '~/neo/editors/useEditors';
import { LinksFunction } from '@remix-run/node';
import editorStylesHref from '@axonivy/form-editor/lib/style.css?url';

export const links: LinksFunction = () => [{ rel: 'stylesheet', href: editorStylesHref }];

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Form' }, { name: 'description', content: 'Axon Ivy Form' }];
};

export default function Index() {
  useRestoreEditor('forms');
  return <></>;
}
