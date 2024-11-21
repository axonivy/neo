import type { LinksFunction, MetaFunction } from '@remix-run/node';
import { type FormIdentifier, useCreateForm, useDeleteForm, useGroupedForms } from '~/data/form-api';
import type { DataClassIdentifier, HdBean } from '~/data/generated/openapi-dev';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { formDescription } from '~/neo/artifact/artifact-description';
import { ArtifactCard, cardStylesLink, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './form-preview.svg?react';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = overviewMetaFunctionProvider('Forms');

export default function Index() {
  const { data, isPending } = useGroupedForms();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (f: HdBean) => f.name);
  const { createFormEditor } = useCreateEditor();
  return (
    <Overview title='Forms' description={formDescription} search={search} onSearchChange={setSearch} isPending={isPending}>
      {filteredGroups.map(({ project, artifacts }) => (
        <ArtifactGroup project={project} newArtifactCard={<NewFormCard />} key={project}>
          {artifacts.map(form => {
            const editor = createFormEditor(form);
            return <FormCard key={editor.id} formId={form.identifier} {...editor} />;
          })}
        </ArtifactGroup>
      ))}
    </Overview>
  );
}

const FormCard = ({ formId, ...editor }: Editor & { formId: FormIdentifier }) => {
  const { deleteForm } = useDeleteForm();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = {
    run: () => {
      removeEditor(editor.id);
      deleteForm(formId);
    },
    isDeletable: editor.project.isIar === false,
    message: 'The form cannot be deleted as the project to which it belongs is packaged.'
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
  const create = (name: string, namespace: string, project?: ProjectIdentifier, pid?: string, dataClass?: DataClassIdentifier) =>
    createForm({ name, namespace, project, dataClass }).then(form => openEditor(createFormEditor(form)));
  const title = 'Create new Form';
  return <NewArtifactCard title={title} open={() => open({ create, type: 'Form', namespaceRequired: true, selectDataClass: true })} />;
};
