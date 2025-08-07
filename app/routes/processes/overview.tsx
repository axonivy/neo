import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import type { ProcessBean } from '~/data/generated/ivy-client';
import { useCreateProcess, useDeleteProcess, useProcesses } from '~/data/process-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import { Breadcrumbs } from '~/neo/Breadcrumb';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { ArtifactCardMenu } from '~/neo/overview/artifact/ArtifactCardMenu';
import { useDeleteConfirmDialog } from '~/neo/overview/artifact/DeleteConfirmDialog';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { CreateNewArtefactButton, Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, OverviewProjectFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewFilterTags } from '~/neo/overview/OverviewFilterTags';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';

export const meta: MetaFunction = overviewMetaFunctionProvider('Processes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useProcesses();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (proc, search, projects, tags) => {
    const hasMatchingProject = projects.length === 0 || projects.includes(proc.processIdentifier.project.pmv);
    const hasMatchingTag =
      tags.length === 0 ||
      tags.some(tag =>
        getProcessTags(proc, t)
          ?.map(t => t.label)
          .includes(tag)
      );
    const nameMatches = proc.name.includes(search);

    return hasMatchingProject && hasMatchingTag && nameMatches;
  });
  const allTags = [
    ...new Set(
      useProcesses().data?.flatMap(p => {
        const tags = getProcessTags(p, t);
        return tags ? tags.map(t => t.label) : [];
      }) ?? []
    )
  ]
    .filter(tag => tag !== 'NORMAL' && tag !== '')
    .sort((a, b) => a.localeCompare(b));

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.processes') }]} />
      <OverviewTitle title={t('neo.processes')} description={t('processes.processDescription')}>
        <NewProcessButton />
      </OverviewTitle>
      <OverviewFilter {...overviewFilter}>
        <OverviewProjectFilter
          projects={overviewFilter.projects}
          setProjects={overviewFilter.setProjects}
          tags={overviewFilter.tags}
          setTags={overviewFilter.setTags}
          allTags={allTags}
        />
      </OverviewFilter>
      <OverviewFilterTags {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        {filteredAritfacts.map(process => (
          <ProcessCard key={`${process.processIdentifier.project.pmv}/${process.processIdentifier.pid}`} process={process} />
        ))}
      </OverviewContent>
    </Overview>
  );
}

const ProcessCard = ({ process }: { process: ProcessBean }) => {
  const { t } = useTranslation();
  const { deleteProcess } = useDeleteProcess();
  const { openEditor, removeEditor } = useEditors();
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  const { createProcessEditor } = useCreateEditor();
  const editor = createProcessEditor(process);
  const tags = getProcessTags(process, t);
  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='process' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      tags={tags}
    >
      <ArtifactCardMenu
        deleteAction={{
          run: () => {
            removeEditor(editor.id);
            deleteProcess(process.processIdentifier);
          },
          isDeletable: editor.project.isIar === false,
          message: t('message.processPackaged'),
          artifact: t('artifact.type.process')
        }}
        {...dialogState}
      />
    </ArtifactCard>
  );
};

export const getProcessTags = (process: ProcessBean, t: (key: string) => string) => {
  const tags: Array<{ label: string; classname: string }> = [];
  if (process.processIdentifier.project.isIar) {
    tags.push({ label: t('common.label.readOnly'), classname: 'tag-readOnly' });
  }
  if (process.kind === 'WEB_SERVICE') {
    tags.push({ label: t('label.webServiceProcess'), classname: 'tag-webService' });
  }
  if (process.kind === 'CALLABLE_SUB') {
    tags.push({ label: t('label.callableSubProcess'), classname: 'tag-callableSub' });
  }
  return tags;
};

export const useProcessExists = () => {
  const { data } = useProcesses();
  return ({ name, namespace, project }: NewArtifactIdentifier) =>
    data
      ?.filter(process => process.processIdentifier.project.pmv === project?.pmv)
      ?.some(process => process.name.toLowerCase() === name.toLowerCase() && process.namespace.toLowerCase() === namespace.toLowerCase()) ??
    false;
};

const NewProcessButton = () => {
  const { t } = useTranslation();
  const open = useNewArtifact();
  const { createProcess } = useCreateProcess();
  const { openEditor } = useEditors();
  const { createProcessEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createProcess({ name, namespace, kind: 'Business Process', project }).then(process => openEditor(createProcessEditor(process)));
  const exists = useProcessExists();
  return (
    <CreateNewArtefactButton
      title={t('processes.newProcess')}
      onClick={() => open({ create, exists, type: 'Process', namespaceRequired: false })}
    />
  );
};
