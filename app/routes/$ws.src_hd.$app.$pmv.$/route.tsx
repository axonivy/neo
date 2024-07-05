import type { MetaFunction } from '@remix-run/node';
import { useRestoreEditor } from '~/neo/editors/useEditors';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Process' }, { name: 'description', content: 'Axon Ivy Process' }];
};

export default function Index() {
  useRestoreEditor('src_hd');
  return <></>;
}
