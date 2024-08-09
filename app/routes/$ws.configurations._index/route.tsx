import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { ProjectIdentifier, useProjects } from '~/data/project-api';
import { ArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';
import { Editor, useCreateEditor, useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './variables-preview.svg?react';

type Variables = {
  path: string;
  project: ProjectIdentifier;
};

const toVariables: (project: ProjectIdentifier) => Variables = (project: ProjectIdentifier) => {
  return { path: `${project.app}/${project.pmv}`, project };
};

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Configurations' }, { name: 'description', content: 'Axon Ivy Configurations Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useProjects();
  const { createVariableEditor } = useCreateEditor();
  const variables =
    data?.map(project => toVariables(project)).filter(vars => vars.path.toLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <Overview title='Configurations' search={search} onSearchChange={setSearch} isPending={isPending}>
      {variables.map(vars => {
        const editor = createVariableEditor(vars.project);
        return <VariablesCard key={editor.id} cardName={vars.path} {...editor} />;
      })}
    </Overview>
  );
}

export const VariablesCard = ({ cardName, ...editor }: Editor & { cardName: string }) => {
  const { openEditor } = useEditors();
  return <ArtifactCard name={cardName} type='variable' preview={<PreviewSVG />} onClick={() => openEditor(editor)} />;
};
