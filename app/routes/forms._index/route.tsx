import { Button, Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { Form, useCreateForm, useDeleteForm, useForms } from '~/data/form-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks } from '~/neo/card/ArtifactCard';
import { useNewArtifactDialog } from '~/neo/dialog/useNewArtifactDialog';
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
        {isPending ? <Spinner size='small' /> : forms.map(form => <FormCard key={form.path ?? form.name} {...form} />)}
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
