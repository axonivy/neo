import { MetaFunction } from '@remix-run/node';
import { useParams } from '@remix-run/react';
import { Fragment } from 'react/jsx-runtime';
import { ProcessIdentifier, useCreateProcess, useDeleteProcess } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { ArtifactCollapsible } from '~/neo/artifact/ArtifactCollapsible';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { Editor, useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './process-preview.svg?react';
import { useGroupedProcesses } from './useGroupedProcesses';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

export default function Index() {
  const { search, setSearch, isPending, groupedProcesses } = useGroupedProcesses();
  const { ws } = useParams();
  const { createProcessEditor } = useCreateEditor();
  return (
    <Overview title='Processes' search={search} onSearchChange={setSearch} isPending={isPending}>
      {groupedProcesses.map(([project, processes]) => {
        const cards = processes.map(process => {
          const editor = createProcessEditor(process);
          return <ProcessCard key={editor.id} processId={process.processIdentifier} {...editor} />;
        });
        return (
          <Fragment key={project}>
            {ws === project ? (
              <>
                <NewProcessCard />
                {cards}
              </>
            ) : (
              <ArtifactCollapsible title={project}>{cards}</ArtifactCollapsible>
            )}
          </Fragment>
        );
      })}
    </Overview>
  );
}

const ProcessCard = ({ processId, ...editor }: Editor & { processId: ProcessIdentifier }) => {
  const { deleteProcess } = useDeleteProcess();
  const { openEditor, removeEditor } = useEditors();
  const open = () => {
    openEditor(editor);
  };
  const deleteAction = () => {
    removeEditor(editor.id);
    deleteProcess(processId);
  };
  return <ArtifactCard name={editor.name} type='process' preview={<PreviewSVG />} onClick={open} actions={{ delete: deleteAction }} />;
};

const NewProcessCard = () => {
  const open = useNewArtifact();
  const { createProcess } = useCreateProcess();
  const { openEditor } = useEditors();
  const { createProcessEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createProcess({ name, namespace, kind: 'Business Process', project }).then(process => openEditor(createProcessEditor(process)));
  const title = 'Create new Process';
  return <NewArtifactCard title={title} open={() => open({ create, title, defaultName: 'MyNewProcess' })} />;
};
