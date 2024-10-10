import type { MetaFunction } from '@remix-run/node';
import type { ProcessBean } from '~/data/generated/openapi-dev';
import { type ProcessIdentifier, useCreateProcess, useDeleteProcess, useGroupedProcesses } from '~/data/process-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './process-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

export default function Index() {
  const { data, isPending } = useGroupedProcesses();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (p: ProcessBean) => p.name);
  const { createProcessEditor } = useCreateEditor();
  return (
    <Overview title='Processes' search={search} onSearchChange={setSearch} isPending={isPending}>
      {filteredGroups.map(({ project, artifacts }) => {
        const cards = artifacts.map(process => {
          const editor = createProcessEditor(process);
          return <ProcessCard key={editor.id} processId={process.processIdentifier} {...editor} />;
        });
        return (
          <ArtifactGroup project={project} newArtifactCard={<NewProcessCard />} key={project}>
            {cards}
          </ArtifactGroup>
        );
      })}
    </Overview>
  );
}

export const ProcessCard = ({ processId, ...editor }: Editor & { processId: ProcessIdentifier }) => {
  const { deleteProcess } = useDeleteProcess();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteProcess(processId);
  };
  return (
    <ArtifactCard
      name={editor.name}
      type='process'
      preview={<PreviewSVG />}
      tooltip={editor.path}
      onClick={open}
      actions={{ delete: deleteAction }}
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
  return <NewArtifactCard title={title} open={() => open({ create, title, defaultName: 'MyNewProcess', defaultNamesapce: '' })} />;
};
