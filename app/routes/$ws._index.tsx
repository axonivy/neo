import { Flex } from '@axonivy/ui-components';
import type { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Neo' }, { name: 'description', content: 'Welcome to Axon Ivy Neo!' }];
};

export default function Index() {
  const params = useParams();
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <Flex direction='row' alignItems='center' justifyContent='space-between'>
        <span style={{ fontWeight: 600, fontSize: 16 }}>Welcome to you Neo workspace: {params.ws}</span>
      </Flex>
    </Flex>
  );
}
