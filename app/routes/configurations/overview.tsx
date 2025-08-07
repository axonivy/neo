import type { BadgeVariants } from '@axonivy/ui-components/lib/components/common/badge/badge.css';
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
import { OverviewFilterTags } from '~/neo/overview/OverviewFilterTags';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';

export const meta: MetaFunction = overviewMetaFunctionProvider('Configurations');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useConfigurations();
  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (config, search, projects, tags) => {
    const hasMatchingProject = projects.length === 0 || projects.includes(config.project.pmv);
    const hasMatchingTag =
      tags.length === 0 ||
      tags.some(tag =>
        getConfigTags(config, t)
          ?.map(t => t.label)
          .includes(tag)
      );
    const nameMatches = config.path.toLocaleLowerCase().includes(search);

    return hasMatchingProject && hasMatchingTag && nameMatches;
  });

  const allTags = [
    ...new Set(
      useConfigurations().data?.flatMap(d => {
        const tags = getConfigTags(d, t);
        return tags?.map(t => t.label) ?? [];
      }) ?? []
    )
  ];

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.configs') }]} />
      <OverviewTitle title={t('neo.configs')} description={t('configurations.configDescription')} />
      <OverviewFilter {...overviewFilter}>
        <OverviewProjectFilter
          projects={overviewFilter.projects}
          setProjects={overviewFilter.setProjects}
          allTags={allTags}
          setTags={overviewFilter.setTags}
          tags={overviewFilter.tags}
        />
      </OverviewFilter>
      <OverviewFilterTags {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        {filteredAritfacts.map(config => (
          <ConfigCard key={`${config.project.pmv}/${config.path}`} config={config} />
        ))}
      </OverviewContent>
    </Overview>
  );
}

const ConfigCard = ({ config }: { config: ConfigurationIdentifier }) => {
  const { t } = useTranslation();
  const { openEditor } = useEditors();
  const { createConfigurationEditor } = useCreateEditor();
  const editor = createConfigurationEditor(config);
  const tags = getConfigTags(config, t);
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

const getConfigTags = (config: ConfigurationIdentifier, t: (key: string) => string) => {
  const tags: Array<{ label: string; badgeVariants: BadgeVariants }> = [];
  if (config.project.isIar) {
    tags.push({ label: t('common.label.readOnly'), badgeVariants: { variant: 'secondary' } });
  }
  return tags;
};
