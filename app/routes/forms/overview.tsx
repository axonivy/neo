import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { useCreateForm, useDeleteForm, useForms } from '~/data/form-api';
import type { DataClassIdentifier, HdBean } from '~/data/generated/ivy-client';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Breadcrumbs } from '~/neo/navigation/Breadcrumb';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import type { Tag } from '~/neo/overview/artifact/ArtifactTag';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { CreateNewArtefactButton, Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, OverviewProjectFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewFilterTags } from '~/neo/overview/OverviewFilterTags';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';

export const meta: MetaFunction = overviewMetaFunctionProvider('Forms');
export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useForms();
  const { allTags, tagsFor } = useTags();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (form, search, projects, tags) => {
    const hasMatchingProject = projects.length === 0 || projects.includes(form.identifier.project.pmv);
    const hasMatchingTag =
      tags.length === 0 ||
      tags.some(tag =>
        tagsFor(form)
          ?.map(t => t.label)
          .includes(tag)
      );
    const nameMatches = form.name.toLocaleLowerCase().includes(search);
    return hasMatchingProject && hasMatchingTag && nameMatches;
  });

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.forms') }]} />
      <OverviewTitle title={t('neo.forms')} description={t('forms.formDescription')}>
        <NewFormButton />
      </OverviewTitle>
      <OverviewFilter {...overviewFilter}>
        <OverviewProjectFilter
          projects={overviewFilter.projects}
          setProjects={overviewFilter.setProjects}
          allTags={allTags}
          tags={overviewFilter.tags}
          setTags={overviewFilter.setTags}
        />
      </OverviewFilter>
      <OverviewFilterTags {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        {filteredAritfacts.map(form => (
          <FormCard key={`${form.identifier.project.pmv}/${form.namespace}/${form.name}`} form={form} />
        ))}
      </OverviewContent>
    </Overview>
  );
}

const FormCard = ({ form }: { form: HdBean }) => {
  const { t } = useTranslation();
  const { deleteForm } = useDeleteForm();
  const { openEditor, removeEditor } = useEditors();
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  const { createFormEditor } = useCreateEditor();
  const editor = createFormEditor(form);
  const { tagsFor } = useTags();
  const tags = tagsFor(form);

  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='form' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      tags={tags}
    >
      <ArtifactCardMenu
        deleteAction={{
          run: () => {
            removeEditor(editor.id);
            deleteForm(form.identifier);
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

const useTags = () => {
  const { t } = useTranslation();
  const allTags: Array<string> = [t('common.label.readOnly')];
  const tagsFor = (form: HdBean) => {
    const tags: Array<Tag> = [];
    if (form.identifier.project.isIar) {
      tags.push({ label: allTags[0], tagStyle: 'secondary' });
    }
    return tags;
  };
  return { allTags, tagsFor };
};

export const useFormExists = () => {
  const { data } = useForms();
  return ({ name, namespace, project }: NewArtifactIdentifier) =>
    data
      ?.filter(form => form.identifier.project.pmv === project?.pmv)
      ?.some(form => form.name.toLowerCase() === name.toLowerCase() && form.namespace?.toLowerCase() === namespace.toLowerCase()) ?? false;
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
