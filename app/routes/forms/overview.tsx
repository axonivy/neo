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
import type { Badge } from '~/neo/overview/artifact/ArtifactBadge';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { CreateNewArtefactButton, Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, OverviewProjectFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewFilterBadges } from '~/neo/overview/OverviewFilterBadges';
import { OverviewSortBy, useSortedArtifacts } from '~/neo/overview/OverviewSortBy';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';

export const meta: MetaFunction = overviewMetaFunctionProvider('Forms');
export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useForms();
  const { allBadges, badgesFor } = useBadges();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (form, search, projects, badges) => {
    const hasMatchingProject = projects.length === 0 || projects.includes(form.identifier.project.pmv);
    const hasMatchingBade =
      badges.length === 0 ||
      badges.some(badge =>
        badgesFor(form)
          ?.map(b => b.label)
          .includes(badge)
      );
    const nameMatches = form.name.toLocaleLowerCase().includes(search);
    return hasMatchingProject && hasMatchingBade && nameMatches;
  });
  const { sortedArtifacts, setSortDirection } = useSortedArtifacts(filteredAritfacts, form => form.name);

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.forms') }]} />
      <OverviewTitle title={t('neo.forms')} description={t('forms.formDescription')}>
        <NewFormButton />
      </OverviewTitle>
      <OverviewFilter {...overviewFilter}>
        <OverviewSortBy setSortDirection={setSortDirection} />
        <OverviewProjectFilter
          projects={overviewFilter.projects}
          setProjects={overviewFilter.setProjects}
          allBadges={allBadges}
          badges={overviewFilter.badges}
          setBadges={overviewFilter.setBadges}
        />
      </OverviewFilter>
      <OverviewFilterBadges {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        {sortedArtifacts.map(form => (
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
  const { badgesFor } = useBadges();
  const badges = badgesFor(form);

  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='form' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      badges={badges}
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

const useBadges = () => {
  const { t } = useTranslation();
  const allBadges: Array<string> = [t('common.label.readOnly')];
  const badgesFor = (form: HdBean) => {
    const badges: Array<Badge> = [];
    if (form.identifier.project.isIar) {
      badges.push({ label: allBadges[0], badgeStyle: 'secondary' });
    }
    return badges;
  };
  return { allBadges, badgesFor };
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
