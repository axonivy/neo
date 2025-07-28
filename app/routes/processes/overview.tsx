import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import type { ProcessBean } from '~/data/generated/ivy-client';
import { useCreateProcess, useDeleteProcess, useGroupedProcesses } from '~/data/process-api';
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

export const meta: MetaFunction = overviewMetaFunctionProvider('Processes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useGroupedProcesses();
  const { filteredGroups, overviewFilter } = useFilteredGroups(data ?? [], (p: ProcessBean) => p.name);
  const { createProcessEditor } = useCreateEditor();

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.processes') }]} />
      <OverviewTitle title={t('neo.processes')} description={t('processes.processDescription')}>
        <NewProcessButton />
      </OverviewTitle>
      <OverviewFilter {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        {filteredGroups.map(({ project, artifacts }) => (
          <ArtifactGroup project={project} key={project}>
            {artifacts.map(process => {
              const editor = createProcessEditor(process);
              return <ProcessCard key={editor.id} process={process} {...editor} />;
            })}
          </ArtifactGroup>
        ))}
      </OverviewContent>
    </Overview>
  );
}

const ProcessCard = ({ process, ...editor }: Editor & { process: ProcessBean }) => {
  const { deleteProcess } = useDeleteProcess();
  const { t } = useTranslation();
  const { openEditor, removeEditor } = useEditors();
  const { artifactCardRef, ...dialogState } = useDeleteConfirmDialog();
  return (
    <ArtifactCard
      ref={artifactCardRef}
      name={editor.name}
      preview={<PreviewSvg type='process' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      tagLabel={
        process.kind === 'CALLABLE_SUB'
          ? t('label.callableSubProcess')
          : process.kind === 'WEB_SERVICE'
            ? t('label.webServiceProcess')
            : undefined
      }
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

export const useProcessExists = () => {
  const { data } = useGroupedProcesses();
  return ({ name, namespace, project }: NewArtifactIdentifier) =>
    data
      ?.find(group => group?.project === project?.pmv)
      ?.artifacts.some(
        process => process.name.toLowerCase() === name.toLowerCase() && process.namespace.toLowerCase() === namespace.toLowerCase()
      ) ?? false;
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
