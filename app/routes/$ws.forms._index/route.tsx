import type { MetaFunction } from '@remix-run/node';
import { type FormIdentifier, useCreateForm, useDeleteForm, useGroupedForms } from '~/data/form-api';
import type { HdBean } from '~/data/generated/openapi-dev';
import type { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './form-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Forms' }, { name: 'description', content: 'Axon Ivy Forms Overview' }];
};

export default function Index() {
  const { data, isPending } = useGroupedForms();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (f: HdBean) => f.name);
  const { createFormEditor } = useCreateEditor();
  return (
    <Overview title='Forms' search={search} onSearchChange={setSearch} isPending={isPending}>
      {filteredGroups.map(({ project, artifacts }) => {
        const cards = artifacts.map(form => {
          const editor = createFormEditor(form);
          return <FormCard key={editor.id} formId={form.identifier} {...editor} />;
        });
        return (
          <ArtifactGroup project={project} newArtifactCard={<NewFormCard />} key={project}>
            {cards}
          </ArtifactGroup>
        );
      })}
    </Overview>
  );
}

const FormCard = ({ formId, ...editor }: Editor & { formId: FormIdentifier }) => {
  const { deleteForm } = useDeleteForm();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteForm(formId);
  };
  return (
    <ArtifactCard
      name={editor.name}
      type='form'
      preview={<PreviewSVG />}
      tooltip={editor.path}
      onClick={open}
      actions={{ delete: deleteAction }}
    />
  );
};

const NewFormCard = () => {
  const open = useNewArtifact();
  const { openEditor } = useEditors();
  const { createForm } = useCreateForm();
  const { createFormEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createForm({ name, namespace, project }).then(form => openEditor(createFormEditor(form)));
  const title = 'Create new Form';
  return <NewArtifactCard title={title} open={() => open({ create, title, defaultName: 'MyNewForm' })} />;
};
