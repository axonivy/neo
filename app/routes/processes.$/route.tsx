import type { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { useRestoreEditor } from '~/neo/useEditors';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Process' }, { name: 'description', content: 'Axon Ivy Process' }];
};

export default function Index() {
  const param = useParams();
  useRestoreEditor('processes', param['*']);
  return <></>;
}
