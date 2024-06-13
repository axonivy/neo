import type { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { useRestoreEditor } from '~/neo/useEditors';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Forms' }, { name: 'description', content: 'Axon Ivy Forms' }];
};

export default function Index() {
  const param = useParams();
  useRestoreEditor('forms', param.app, param.pmv, param['*']);
  return <></>;
}
