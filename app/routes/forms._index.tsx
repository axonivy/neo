import { Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { useForms } from '~/data/form-api';
import { ProjectArtifactCard, cardLinks } from '~/neo/card/ProjectArtifactCard';

export const links: LinksFunction = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Forms' }, { name: 'description', content: 'Axon Ivy Forms Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isLoading } = useForms();
  const forms = data?.filter(form => form.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <Flex direction='row' alignItems='center' justifyContent='space-between'>
        <span style={{ fontWeight: 600, fontSize: 16 }}>Forms</span>
      </Flex>
      <SearchInput value={search} onChange={setSearch} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {isLoading && <Spinner size='small' />}
        {forms.map(form => (
          <ProjectArtifactCard
            key={form.path ?? form.name}
            app={form.identifier.app}
            pmv={form.identifier.pmv}
            editorType={'forms'}
            {...form}
          />
        ))}
      </Flex>
    </Flex>
  );
}
