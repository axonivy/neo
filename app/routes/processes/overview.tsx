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
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (proc, search, projects) => {
    return (projects.length === 0 || projects.includes(proc.processIdentifier.project.pmv)) && proc.name.includes(search);
  });
  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.processes') }]} />
      <OverviewTitle title={t('neo.processes')} description={t('processes.processDescription')}>
        <NewProcessButton />
      </OverviewTitle>
      <OverviewFilter {...overviewFilter}>
        <OverviewProjectFilter projects={overviewFilter.projects} setProjects={overviewFilter.setProjects} />
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
  const tags = useProcessTags(process);
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

const useProcessTags = (process: ProcessBean) => {
  const { t } = useTranslation();
  const tags = [];
  if (process.processIdentifier.project.isIar) {
    tags.push(t('common.label.readOnly'));
  }
  if (process.kind === 'WEB_SERVICE') {
    tags.push(t('label.webServiceProcess'));
  }
  if (process.kind === 'CALLABLE_SUB') {
    tags.push(t('label.callableSubProcess'));
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
