import type { MetaFunction } from '@remix-run/node';
import { useSortedProjects } from '~/data/project-api';
import { configDescription } from '~/neo/artifact/artifact-description';
import { ArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import { useSearch } from '~/neo/useSearch';
import PreviewSVG from './variables-preview.svg?react';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Configurations' }, { name: 'description', content: 'Axon Ivy Configurations Overview' }];
};

export default function Index() {
  const { search, setSearch } = useSearch();
  const { data, isPending } = useSortedProjects();
  const { createVariableEditor } = useCreateEditor();
  const projects = data?.filter(({ id }) => id.pmv.toLowerCase().includes(search.toLocaleLowerCase())).map(p => p.id) ?? [];
  return (
    <Overview title='Configurations' description={configDescription} search={search} onSearchChange={setSearch} isPending={isPending}>
      {projects.map(project => {
        const editor = createVariableEditor(project);
        const card = <VariablesCard key={editor.id} {...editor} />;
        return (
          <ArtifactGroup project={project.pmv} search={search} key={project.pmv}>
            {card}
          </ArtifactGroup>
        );
      })}
    </Overview>
  );
}

export const VariablesCard = ({ ...editor }: Editor) => {
  const { openEditor } = useEditors();
  return (
    <ArtifactCard name={'variables'} type='variables' preview={<PreviewSVG />} tooltip={editor.path} onClick={() => openEditor(editor)} />
  );
};
