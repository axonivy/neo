import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import { useCreateForm, useDeleteForm, useGroupedForms, type FormIdentifier } from '~/data/form-api';
import type { DataClassIdentifier, HdBean } from '~/data/generated/ivy-client';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { ArtifactCard, cardStylesLink, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { PreviewSvg } from '~/neo/artifact/PreviewSvg';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = overviewMetaFunctionProvider('Forms');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useGroupedForms();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (f: HdBean) => f.name);
  const { createFormEditor } = useCreateEditor();
  return (
    <Overview
      title={t('neo.forms')}
      description={t('forms.formDescription')}
      search={search}
      onSearchChange={setSearch}
      isPending={isPending}
    >
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
  const { t } = useTranslation();
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
    message: t('message.formPackaged')
  };
  return (
    <ArtifactCard
      name={editor.name}
      type='form'
      preview={<PreviewSvg type='form' />}
      tooltip={editor.path}
      onClick={open}
      actions={{ delete: deleteAction }}
    />
  );
};

export const useFormExists = () => {
  const { data } = useGroupedForms();
  return ({ name, namespace, project }: NewArtifactIdentifier) =>
    data
      ?.find(group => group?.project === project?.pmv)
      ?.artifacts.some(
        form => form.name.toLowerCase() === name.toLowerCase() && form.namespace?.toLowerCase() === namespace.toLowerCase()
      ) ?? false;
};

const NewFormCard = () => {
  const { t } = useTranslation();
  const open = useNewArtifact();
  const { openEditor } = useEditors();
  const { createForm } = useCreateForm();
  const { createFormEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier, pid?: string, dataClass?: DataClassIdentifier) =>
    createForm({ name, namespace, project, dataClass }).then(form => openEditor(createFormEditor(form)));
  const exists = useFormExists();
  const title = t('forms.newForm');
  return (
    <NewArtifactCard title={title} open={() => open({ create, exists, type: 'Form', namespaceRequired: true, selectDataClass: true })} />
  );
};
