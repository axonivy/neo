import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import type { ProcessBean } from '~/data/generated/ivy-client';
import { useCreateProcess, useDeleteProcess, useGroupedProcesses } from '~/data/process-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { ArtifactCard, cardStylesLink } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { PreviewSvg } from '~/neo/artifact/PreviewSvg';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { CreateNewArtefactButton, Overview } from '~/neo/Overview';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = overviewMetaFunctionProvider('Processes');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useGroupedProcesses();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (p: ProcessBean) => p.name);
  const { createProcessEditor } = useCreateEditor();

  return (
    <Overview
      title={t('neo.processes')}
      description={t('processes.processDescription')}
      search={search}
      onSearchChange={setSearch}
      isPending={isPending}
      control={<NewProcessButton />}
    >
      {filteredGroups.map(({ project, artifacts }) => (
        <ArtifactGroup project={project} key={project}>
          {artifacts.map(process => {
            const editor = createProcessEditor(process);
            return <ProcessCard key={editor.id} process={process} {...editor} />;
          })}
        </ArtifactGroup>
      ))}
    </Overview>
  );
}

const ProcessCard = ({ process, ...editor }: Editor & { process: ProcessBean }) => {
  const { deleteProcess } = useDeleteProcess();
  const { t } = useTranslation();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = {
    run: () => {
      removeEditor(editor.id);
      deleteProcess(process.processIdentifier);
    },
    isDeletable: editor.project.isIar === false,
    message: t('message.processPackaged')
  };
  const tagLabel = process.kind === 'CALLABLE_SUB' ? 'Callable Subprocess' : process.kind === 'WEB_SERVICE' ? 'Web Service' : '';
  return (
    <ArtifactCard
      name={editor.name}
      type='process'
      preview={<PreviewSvg type='process' />}
      tooltip={editor.path}
      onClick={open}
      actions={{ delete: deleteAction }}
      tagLabel={tagLabel}
    />
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
      open={() => open({ create, exists, type: 'Process', namespaceRequired: false })}
    />
  );
};
