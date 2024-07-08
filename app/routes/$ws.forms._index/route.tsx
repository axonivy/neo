import type { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { useState } from 'react';
import { FormIdentifier, useCreateForm, useDeleteForm, useForms } from '~/data/form-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { createFormEditor, Editor, useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import FormPreviewSVG from './form-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Forms' }, { name: 'description', content: 'Axon Ivy Forms Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useForms();
  const ws = useParams().ws ?? 'designer';
  const forms = data?.filter(form => form.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <Overview title='Forms' search={search} onSearchChange={setSearch} isPending={isPending}>
      <NewFormCard />
      {forms.map(form => {
        const editor = createFormEditor({ ws, ...form });
        return <FormCard key={editor.id} formId={form.identifier} {...editor} />;
      })}
    </Overview>
  );
}

export const FormCard = ({ formId, ...editor }: Editor & { formId: FormIdentifier }) => {
  const { deleteForm } = useDeleteForm();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteForm(formId);
  };
  return <ArtifactCard name={editor.name} type='form' preview={<FormPreviewSVG />} onClick={open} actions={{ delete: deleteAction }} />;
};

const NewFormCard = () => {
  const open = useNewArtifact();
  const { openEditor } = useEditors();
  const { createForm } = useCreateForm();
  const ws = useParams().ws ?? 'designer';
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createForm({ name, namespace, type: 'Form', project }).then(form => openEditor(createFormEditor({ ws, ...form })));
  const title = 'Create new Form';
  return <NewArtifactCard title={title} open={() => open({ create, title, defaultName: 'MyNewForm' })} />;
};
