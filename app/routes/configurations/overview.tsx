import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { useConfigurations } from '~/data/config-api';
import type { ConfigurationIdentifier } from '~/data/generated/ivy-client';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { Breadcrumbs } from '~/neo/Breadcrumb';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, OverviewProjectFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';

export const meta: MetaFunction = overviewMetaFunctionProvider('Configurations');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useConfigurations();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(
    data ?? [],
    (config, search, projects) =>
      (projects.length === 0 || projects.includes(config.project.pmv)) && config.path.toLocaleLowerCase().includes(search)
  );
  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.configs') }]} />
      <OverviewTitle title={t('neo.configs')} description={t('configurations.configDescription')} />
      <OverviewFilter {...overviewFilter}>
        <OverviewProjectFilter projects={overviewFilter.projects} setProjects={overviewFilter.setProjects} />
      </OverviewFilter>
      <OverviewContent isPending={isPending}>
        {filteredAritfacts.map(config => (
          <ConfigCard key={`${config.project.pmv}/${config.path}`} config={config} />
        ))}
      </OverviewContent>
    </Overview>
  );
}

const ConfigCard = ({ config }: { config: ConfigurationIdentifier }) => {
  const { openEditor } = useEditors();
  const { createConfigurationEditor } = useCreateEditor();
  const editor = createConfigurationEditor(config);
  const tags = useConfigTags(config);
  return (
    <ArtifactCard
      key={editor.id}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='config' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      tags={tags}
    />
  );
};

const useConfigTags = (config: ConfigurationIdentifier) => {
  const { t } = useTranslation();
  const tags = [];
  if (config.project.isIar) {
    tags.push(t('common.label.readOnly'));
  }
  return tags;
};
