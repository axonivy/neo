import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { useProjects } from '~/data/project-api';
import { ArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { Editor, useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './variables-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Configurations' }, { name: 'description', content: 'Axon Ivy Configurations Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useProjects();
  const { createVariableEditor } = useCreateEditor();
  const projects = data?.filter(project => project.pmv.toLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <Overview title='Configurations' search={search} onSearchChange={setSearch} isPending={isPending}>
      {projects.map(project => {
        const editor = createVariableEditor(project);
        const card = <VariablesCard key={editor.id} {...editor} />;
        return (
          <ArtifactGroup project={project.pmv} key={project.pmv}>
            {card}
          </ArtifactGroup>
        );
      })}
    </Overview>
  );
}

export const VariablesCard = ({ ...editor }: Editor) => {
  const { openEditor } = useEditors();
  return <ArtifactCard name={'variables'} type='variables' preview={<PreviewSVG />} onClick={() => openEditor(editor)} />;
};
