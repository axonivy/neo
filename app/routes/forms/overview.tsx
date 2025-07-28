import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { useCreateForm, useDeleteForm, useGroupedForms, type FormIdentifier } from '~/data/form-api';
import type { DataClassIdentifier, HdBean } from '~/data/generated/ivy-client';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import { Breadcrumbs } from '~/neo/Breadcrumb';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { CreateNewArtefactButton, Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';

export const meta: MetaFunction = overviewMetaFunctionProvider('Forms');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useGroupedForms();
  const { filteredGroups, overviewFilter } = useFilteredGroups(data ?? [], (f: HdBean) => f.name);
  const { createFormEditor } = useCreateEditor();

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.forms') }]} />
      <OverviewTitle title={t('neo.forms')} description={t('forms.formDescription')}>
        <NewFormButton />
      </OverviewTitle>
      <OverviewFilter {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        {filteredGroups.map(({ project, artifacts }) => (
          <ArtifactGroup project={project} key={project}>
            {artifacts.map(form => {
              const editor = createFormEditor(form);
              return <FormCard key={editor.id} formId={form.identifier} {...editor} />;
            })}
          </ArtifactGroup>
        ))}
      </OverviewContent>
    </Overview>
  );
}

const FormCard = ({ formId, ...editor }: Editor & { formId: FormIdentifier }) => {
  const { t } = useTranslation();
  const { deleteForm } = useDeleteForm();
  const { openEditor, removeEditor } = useEditors();
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={editor.name}
      preview={<PreviewSvg type='form' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
    >
      <ArtifactCardMenu
        deleteAction={{
          run: () => {
            removeEditor(editor.id);
            deleteForm(formId);
          },
          isDeletable: editor.project.isIar === false,
          message: t('message.formPackaged'),
          artifact: t('artifact.type.form')
        }}
        {...dialogState}
      />
    </ArtifactCard>
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

const NewFormButton = () => {
  const { t } = useTranslation();
  const open = useNewArtifact();
  const { openEditor } = useEditors();
  const { createForm } = useCreateForm();
  const { createFormEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier, pid?: string, dataClass?: DataClassIdentifier) =>
    createForm({ name, namespace, project, dataClass }).then(form => openEditor(createFormEditor(form)));
  const exists = useFormExists();
  return (
    <CreateNewArtefactButton
      title={t('forms.newForm')}
      onClick={() => open({ create, exists, type: 'Form', namespaceRequired: true, selectDataClass: true })}
    />
  );
};
