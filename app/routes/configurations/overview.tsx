import { useTranslation } from 'react-i18next';
import type { MetaFunction } from 'react-router';
import { useConfigurations } from '~/data/config-api';
import type { ConfigurationIdentifier } from '~/data/generated/ivy-client';
import { overviewMetaFunctionProvider } from '~/metaFunctionProvider';
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
import { OverviewTitle } from '~/neo/overview/OverviewTitle';

export const meta: MetaFunction = overviewMetaFunctionProvider('Configurations');

export default function Index() {
  const { t } = useTranslation();
  const { data, isPending } = useConfigurations();
  const { allBadges, badgesFor } = useBadges();

  const { filteredAritfacts, ...overviewFilter } = useOverviewFilter(data ?? [], (config, search, projects, badges) => {
    const hasMatchingProject = projects.length === 0 || projects.includes(config.project.pmv);
    const hasMatchingBadge =
      badges.length === 0 ||
      badges.some(badge =>
        badgesFor(config)
          ?.map(b => b.label)
          .includes(badge)
      );
    const nameMatches = config.path.toLocaleLowerCase().includes(search);

    return hasMatchingProject && hasMatchingBadge && nameMatches;
  });

  return (
    <Overview>
      <Breadcrumbs items={[{ name: t('neo.configs') }]} />
      <OverviewTitle title={t('neo.configs')} description={t('configurations.configDescription')} />
      <OverviewFilter {...overviewFilter}>
        <OverviewProjectFilter
          projects={overviewFilter.projects}
          setProjects={overviewFilter.setProjects}
          allBadges={allBadges}
          setBadges={overviewFilter.setBadges}
          badges={overviewFilter.badges}
        />
      </OverviewFilter>
      <OverviewFilterBadges {...overviewFilter} />
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
  const { badgesFor } = useBadges();
  const badges = badgesFor(config);
  return (
    <ArtifactCard
      key={editor.id}
      name={editor.name}
      description={editor.project.pmv}
      preview={<PreviewSvg type='config' />}
      tooltip={editor.path}
      onClick={() => openEditor(editor)}
      badges={badges}
    />
  );
};

const useBadges = () => {
  const { t } = useTranslation();
  const allBadges: Array<string> = [t('common.label.readOnly')];
  const badgesFor = (config: ConfigurationIdentifier) => {
    const badges: Array<Badge> = [];
    if (config.project.isIar) {
      badges.push({ label: allBadges[0], badgeStyle: 'secondary' });
    }
    return badges;
  };
  return { allBadges: allBadges, badgesFor };
};
