import type { LinksFunction, MetaFunction } from 'react-router';
import { useGroupedConfigurations } from '~/data/config-api';
import type { ConfigurationIdentifier } from '~/data/generated/openapi-dev';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { configDescription } from '~/neo/artifact/artifact-description';
import { ArtifactCard, cardStylesLink } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import type { Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';
import PreviewSVG from './variables-preview.svg?react';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = overviewMetaFunctionProvider('Configurations');

export default function Index() {
  const { data, isPending } = useGroupedConfigurations();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (c: ConfigurationIdentifier) => `${c.project.pmv} ${c.path}`);
  const { createConfigurationEditor } = useCreateEditor();
  return (
    <Overview title='Configurations' description={configDescription} search={search} onSearchChange={setSearch} isPending={isPending}>
      {filteredGroups.map(({ project, artifacts }) => (
        <ArtifactGroup project={project} key={project}>
          {artifacts.map(config => {
            const editor = createConfigurationEditor(config);
            return <ConfigCard key={editor.id} {...editor} />;
          })}
        </ArtifactGroup>
      ))}
    </Overview>
  );
}

const ConfigCard = ({ ...editor }: Editor) => {
  const { openEditor } = useEditors();
  return (
    <ArtifactCard name={editor.name} type='variables' preview={<PreviewSVG />} tooltip={editor.path} onClick={() => openEditor(editor)} />
  );
};
