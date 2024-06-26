import { Button, Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { useCreateForm, useDeleteForm, useForms } from '~/data/form-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ProjectArtifactCard, cardLinks } from '~/neo/card/ProjectArtifactCard';
import { useNewArtifactDialog } from '~/neo/dialog/useNewArtifactDialog';

export const links: LinksFunction = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Forms' }, { name: 'description', content: 'Axon Ivy Forms Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useForms();
  const forms = data?.filter(form => form.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const { deleteForm } = useDeleteForm();
  const { createForm } = useCreateForm();
  const { open } = useNewArtifactDialog();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) => createForm({ name, namespace, type: 'Form', project });
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <Flex direction='row' alignItems='center' justifyContent='space-between'>
        <span style={{ fontWeight: 600, fontSize: 16 }}>Forms</span>
        <Button icon={IvyIcons.Plus} size='large' onClick={() => open({ create, defaultName: 'MyNewForm', title: 'Create new Form' })} />
      </Flex>
      <SearchInput value={search} onChange={setSearch} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {isPending ? (
          <Spinner size='small' />
        ) : (
          forms.map(form => (
            <ProjectArtifactCard
              key={form.path ?? form.name}
              project={form.identifier.project}
              editorType={'forms'}
              {...form}
              actions={{ delete: () => deleteForm(form.identifier) }}
            />
          ))
        )}
      </Flex>
    </Flex>
  );
}
