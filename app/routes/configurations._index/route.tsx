import { Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { ArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';
import FormPreviewSVG from './form-preview.svg?react';
import { ProjectIdentifier, useProjects } from '~/data/project-api';
import { createVariableEditor, useEditors } from '~/neo/editors/useEditors';

export const links = cardLinks;

export const meta: MetaFunction = () => {
  return [{ title: 'Axon Ivy Configurations' }, { name: 'description', content: 'Axon Ivy Configurations Overview' }];
};

export default function Index() {
  const [search, setSearch] = useState('');
  const { data, isPending } = useProjects();
  const projects = data ?? [];
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <span style={{ fontWeight: 600, fontSize: 16 }}>Configurations</span>
      <SearchInput value={search} onChange={setSearch} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {isPending ? (
          <Spinner size='small' />
        ) : (
          <>
            {projects.map(project => (
              <VariableCard key={project.app + '/' + project.pmv} {...project} />
            ))}
          </>
        )}
      </Flex>
    </Flex>
  );
}

export const VariableCard = (project: ProjectIdentifier) => {
  const { openEditor } = useEditors();
  const editor = createVariableEditor(project);
  const open = () => openEditor(editor);
  return <ArtifactCard name={project.app + '/' + project.pmv} type='variable' preview={<FormPreviewSVG />} onClick={open} />;
};
