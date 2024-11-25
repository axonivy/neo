import type { LinksFunction, MetaFunction } from 'react-router';
import type { ProcessBean } from '~/data/generated/openapi-dev';
import { useCreateProcess, useDeleteProcess, useGroupedProcesses } from '~/data/process-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { processDescription } from '~/neo/artifact/artifact-description';
import { ArtifactCard, cardStylesLink, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './process-preview.svg?react';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = overviewMetaFunctionProvider('Processes');

export default function Index() {
  const { data, isPending } = useGroupedProcesses();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (p: ProcessBean) => p.name);
  const { createProcessEditor } = useCreateEditor();
  return (
    <Overview title='Processes' description={processDescription} search={search} onSearchChange={setSearch} isPending={isPending}>
      {filteredGroups.map(({ project, artifacts }) => (
        <ArtifactGroup project={project} newArtifactCard={<NewProcessCard />} key={project}>
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
    message: 'The process cannot be deleted as the project to which it belongs is packaged.'
  };
  const tagLabel = process.kind === 'CALLABLE_SUB' ? 'Callable Subprocess' : process.kind === 'WEB_SERVICE' ? 'Web Service' : '';
  return (
    <ArtifactCard
      name={editor.name}
      type='process'
      preview={<PreviewSVG />}
      tooltip={editor.path}
      onClick={open}
      actions={{ delete: deleteAction }}
      tagLabel={tagLabel}
    />
  );
};

const NewProcessCard = () => {
  const open = useNewArtifact();
  const { createProcess } = useCreateProcess();
  const { openEditor } = useEditors();
  const { createProcessEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createProcess({ name, namespace, kind: 'Business Process', project }).then(process => openEditor(createProcessEditor(process)));
  const title = 'Create new Process';
  return <NewArtifactCard title={title} open={() => open({ create, type: 'Process', namespaceRequired: false })} />;
};
