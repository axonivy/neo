import { Separator } from '@axonivy/ui-components';
import { MetaFunction } from '@remix-run/node';
import { useMemo, useState } from 'react';
import { ProcessIdentifier, useCreateProcess, useDeleteProcess, useProcesses } from '~/data/process-api';
import { ProjectIdentifier } from '~/data/project-api';
import { ArtifactCard, cardLinks, NewArtifactCard } from '~/neo/artifact/ArtifactCard';
import { useNewArtifact } from '~/neo/artifact/useNewArtifact';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { Editor, useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './process-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Processes' }, { name: 'description', content: 'Axon Ivy Processes Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useProcesses();
  const { createProcessEditor } = useCreateEditor();
  const processes = useMemo(
    () => data?.filter(proc => proc.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())) ?? [],
    [data, search]
  );
  const groupedProcesses = useMemo(() => groupBy(processes, p => p.processIdentifier.project.pmv), [processes]);

  return (
    <Overview title='Processes' search={search} onSearchChange={setSearch} isPending={isPending}>
      {Object.entries(groupedProcesses).map(([project, data]) => {
        return (
          <>
            <ArtifactSeparator title={project} />
            {data.length > 0 ? <NewProcessCard /> : <NewProcessCard />}
            {data.map(process => {
              const editor = createProcessEditor(process);
              return <ProcessCard key={editor.id} processId={process.processIdentifier} {...editor} />;
            })}
          </>
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

const ArtifactSeparator = ({ title }: { title: string }) => {
  return (
    <>
      <span style={{ width: '100%', fontSize: 14 }}>{title}</span>
      <Separator decorative={true} style={{ margin: '0' }} />
    </>
  );
};

function groupBy<T>(arr: T[], resolveKey: (t: T) => string) {
  return arr.reduce<Record<string, T[]>>((prev, curr) => {
    const groupKey = resolveKey(curr);
    const group = prev[groupKey] || [];
    group.push(curr);
    return { ...prev, [groupKey]: group };
  }, {});
}
