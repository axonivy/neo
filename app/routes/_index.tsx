import type { MetaFunction } from '@remix-run/node';

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Neo' }, { name: 'description', content: 'Welcome to Axon Ivy Neo!' }];
};

export default function Index() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Welcome to Neo</h1>
    </div>
  );
}
