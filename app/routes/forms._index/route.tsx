import { Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { Form, useCreateForm, useDeleteForm, useForms } from '~/data/form-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, NewArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';
import FormPreviewSVG from './form-preview.svg?react';
import { createFormEditor, useEditors } from '~/neo/editors/useEditors';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Forms' }, { name: 'description', content: 'Axon Ivy Forms Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useForms();
  const forms = data?.filter(form => form.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  const { createForm } = useCreateForm();
  const { openEditor } = useEditors();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createForm({ name, namespace, type: 'Form', project }).then(form => openEditor(createFormEditor(form)));
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

export const FormCard = (form: Form) => {
  const { deleteForm } = useDeleteForm();
  const { openEditor, removeEditor } = useEditors();
  const editor = createFormEditor(form);
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteForm(form.identifier);
  };
  return <ArtifactCard name={editor.name} type='form' preview={<FormPreviewSVG />} onClick={open} actions={{ delete: deleteAction }} />;
};
