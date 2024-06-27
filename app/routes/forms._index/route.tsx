import { Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { Form, useCreateForm, useDeleteForm, useForms } from '~/data/form-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, NewArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';
import FormPreviewSVG from './form-preview.svg?react';
import { editorIcon, editorId, useEditors } from '~/neo/useEditors';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Forms' }, { name: 'description', content: 'Axon Ivy Forms Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useForms();
  const forms = data?.filter(form => form.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const { createForm } = useCreateForm();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) => createForm({ name, namespace, type: 'Form', project });
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <span style={{ fontWeight: 600, fontSize: 16 }}>Forms</span>
      <SearchInput value={search} onChange={setSearch} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {isPending ? (
          <Spinner size='small' />
        ) : (
          <>
            <NewArtifactCard create={create} title='Create new Form' defaultName='MyNewForm' />
            {forms.map(form => (
              <FormCard key={form.path ?? form.name} {...form} />
            ))}
          </>
        )}
      </Flex>
    </Flex>
  );
}

export const FormCard = ({ name, path, identifier }: Form) => {
  const { deleteForm } = useDeleteForm();
  const { openEditor, removeEditor } = useEditors();
  const project = identifier.project;
  const id = editorId('forms', project, path);
  const open = () => {
    openEditor({ id, type: 'forms', icon: editorIcon('forms'), name, project, path });
  };
  const deleteAction = () => {
    removeEditor(id);
    deleteForm(identifier);
  };
  return <ArtifactCard name={name} type='process' preview={<FormPreviewSVG />} onClick={open} actions={{ delete: deleteAction }} />;
};
