import type { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { useRestoreEditor } from '~/neo/useEditors';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Process' }, { name: 'description', content: 'Axon Ivy Process' }];
};

export default function Index() {
  const param = useParams();
  useRestoreEditor('processes', param['*']);
  return (
    <iframe
      key={param['*']}
      title='process'
      src={`http://localhost:3000/?server=localhost:8081&app=designer&pmv=workflow-demos&file=/processes/${param['*']}.p.json`}
      style={{ width: '100%', height: '100%', border: 'none' }}
    />
  );
}
