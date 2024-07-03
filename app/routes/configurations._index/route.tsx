import { Flex, SearchInput, Spinner } from '@axonivy/ui-components';
import type { MetaFunction } from '@remix-run/node';
import { useState } from 'react';
import { ArtifactCard, cardLinks } from '~/neo/artifact/ArtifactCard';
import VariablesPreviewSVG from './variables-preview.svg?react';
import { ProjectIdentifier, useProjects } from '~/data/project-api';
import { createVariableEditor, useEditors } from '~/neo/editors/useEditors';

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
  const variables =
    data?.map(project => toVariables(project)).filter(vars => vars.path.toLowerCase().includes(search.toLocaleLowerCase())) ?? [];
  return (
    <Flex direction='column' gap={4} style={{ padding: 30, height: 'calc(100% - 60px)', overflowY: 'auto' }}>
      <span style={{ fontWeight: 600, fontSize: 16 }}>Configurations</span>
      <SearchInput value={search} onChange={setSearch} />
      <Flex gap={4} style={{ flexWrap: 'wrap' }}>
        {isPending ? (
          <Spinner size='small' />
        ) : (
          <>
            {variables.map(vars => (
              <VariablesCard key={vars.path} {...vars} />
            ))}
          </>
        )}
      </Flex>
    </Flex>
  );
}

export const VariablesCard = (vars: Variables) => {
  const { openEditor } = useEditors();
  const editor = createVariableEditor(vars.project);
  const open = () => openEditor(editor);
  return <ArtifactCard name={vars.path} type='variable' preview={<VariablesPreviewSVG />} onClick={open} />;
};
