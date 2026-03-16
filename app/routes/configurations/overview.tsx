import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { useConfigurations } from '~/data/config-api';
import type { ConfigurationIdentifier } from '~/data/generated/ivy-client';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
import { CONFIG_EDITOR_XML_SUFFIX, CONFIG_EDITOR_YAML_SUFFIX } from '~/neo/editors/editor';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { Breadcrumbs } from '~/neo/navigation/Breadcrumb';
import type { Badge } from '~/neo/overview/artifact/ArtifactBadge';
import { ArtifactCard } from '~/neo/overview/artifact/ArtifactCard';
import { PreviewSvg } from '~/neo/overview/artifact/PreviewSvg';
import { Overview } from '~/neo/overview/Overview';
import { OverviewContent } from '~/neo/overview/OverviewContent';
import { OverviewFilter, OverviewProjectFilter, useOverviewFilter } from '~/neo/overview/OverviewFilter';
import { OverviewFilterBadges } from '~/neo/overview/OverviewFilterBadges';
import { OverviewSortBy, useSortedArtifacts } from '~/neo/overview/OverviewSortBy';
import { OverviewTitle } from '~/neo/overview/OverviewTitle';
import { lastSegment } from '~/utils/path';

export const meta: MetaFunction = overviewMetaFunctionProvider('Configurations');
export const CONFIG_TYPE_ICONS: Record<string, IvyIcons> = {
  cms: IvyIcons.Cms,
  databases: IvyIcons.Database,
  'webservice-clients': IvyIcons.WsStart,
  persistence: IvyIcons.DatabaseLink,
  users: IvyIcons.User,
  variables: IvyIcons.Variables,
  roles: IvyIcons.Users,
  'rest-clients': IvyIcons.RestClient
};

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useConfigurations();
  const { allBadges, badgesFor } = useBadges();

  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (config, search, projects, badges, types) => {
    const hasMatchingProject = projects.length === 0 || projects.includes(config.project.pmv);
    const hasMatchingBadge =
      badges.length === 0 ||
      badges.some(badge =>
        badgesFor(config)
          ?.map(b => b.label)
          .includes(badge)
      );
    const configType = lastSegment(config.path).split(CONFIG_EDITOR_YAML_SUFFIX)[0]?.split(CONFIG_EDITOR_XML_SUFFIX)[0] ?? '';
    const hasMatchingType = !types || types.length === 0 || types.includes(configType);
    const nameMatches = config.path.toLocaleLowerCase().includes(search);
    return hasMatchingProject && hasMatchingBadge && hasMatchingType && nameMatches;
  });
  const { sortedArtifacts, setSortDirection } = useSortedArtifacts(filteredAritfacts, config => config.path);

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.configs') }]} />
      <OverviewTitle title={t('neo.configs')} description={t('configurations.configDescription')} />
      <OverviewFilter {...overviewFilter}>
        <OverviewSortBy setSortDirection={setSortDirection} />
        <OverviewProjectFilter
          projects={overviewFilter.projects}
          setProjects={overviewFilter.setProjects}
          allBadges={allBadges}
          setBadges={overviewFilter.setBadges}
          badges={overviewFilter.badges}
          typeFilter={{
            types: overviewFilter.types,
            setTypes: overviewFilter.setTypes,
            allTypes: CONFIG_TYPE_ICONS ? Object.keys(CONFIG_TYPE_ICONS) : []
          }}
        />
      </OverviewFilter>
      <OverviewFilterBadges {...overviewFilter} />
      <OverviewContent isPending={isPending}>
        {sortedArtifacts.map(config => (
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
  const { badgesFor } = useBadges();
  const badges = badgesFor(config);
  const configType = lastSegment(config.path).split(CONFIG_EDITOR_YAML_SUFFIX)[0]?.split(CONFIG_EDITOR_XML_SUFFIX)[0] ?? '';
  const icon = CONFIG_TYPE_ICONS[configType] ?? IvyIcons.Cms;
  return (
    <ArtifactCard
      key={editor.id}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='config' />}
      icon={icon}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      badges={badges}
    />
  );
};

const useBadges = () => {
  const { t } = useTranslation();
  const allBadges = [t('common.label.readOnly')] as const;
  const badgesFor = (config: ConfigurationIdentifier) => {
    const badges: Array<Badge> = [];
    if (config.project.isIar) {
      badges.push({ label: allBadges[0], badgeStyle: 'secondary' });
    }
    return badges;
  };
  return { allBadges: allBadges, badgesFor };
};
