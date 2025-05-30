import { useTranslation } from 'react-i18next';
import type { LinksFunction, MetaFunction } from 'react-router';
import { useGroupedConfigurations } from '~/data/config-api';
import type { ConfigurationIdentifier } from '~/data/generated/ivy-client';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { ArtifactCard, cardStylesLink } from '~/neo/artifact/ArtifactCard';
import { ArtifactGroup } from '~/neo/artifact/ArtifactGroup';
import { PreviewSvg } from '~/neo/artifact/PreviewSvg';
import { useFilteredGroups } from '~/neo/artifact/useFilteredGroups';
import { CMS_EDITOR_SUFFIX, type Editor } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Overview } from '~/neo/Overview';

export const links: LinksFunction = () => [cardStylesLink];

export const meta: MetaFunction = overviewMetaFunctionProvider('Configurations');

export default function Index() {
  const { data, isPending } = useGroupedConfigurations();
  const { filteredGroups, search, setSearch } = useFilteredGroups(data ?? [], (c: ConfigurationIdentifier) => `${c.project.pmv} ${c.path}`);
  const { createConfigurationEditor, createCmsEditor } = useCreateEditor();
  const { openEditor } = useEditors();
  const { t } = useTranslation();

  return (
    <Overview
      title={t('neo.configs')}
      description={t('configurations.configDescription')}
      search={search}
      onSearchChange={setSearch}
      isPending={isPending}
    >
      {filteredGroups.map(({ project, artifacts }) => (
        <ArtifactGroup project={project} key={project}>
          {(search.length === 0 || CMS_EDITOR_SUFFIX.startsWith(search.toLowerCase())) && (
            <ArtifactCard
              name={CMS_EDITOR_SUFFIX}
              type='cms'
              preview={<PreviewSvg type='config' />}
              tooltip={CMS_EDITOR_SUFFIX}
              onClick={() => openEditor(createCmsEditor(artifacts[0].project))}
            />
          )}
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
    <ArtifactCard
      name={editor.name}
      type='variables'
      preview={<PreviewSvg type='config' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
    />
  );
};
