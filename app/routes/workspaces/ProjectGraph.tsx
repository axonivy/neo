import { Button } from '@axonivy/ui-components';
import { Graph, type NodeData } from '@axonivy/ui-graph';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import type { ProjectBean } from '~/data/generated/ivy-client';
import { useSortedProjects } from '~/data/project-api';

export const ProjectGraph = () => {
  const { data: projects } = useSortedProjects(true);
  const { t } = useTranslation();
  return (
    <Graph
      graphNodes={mapProjectsToGraphNodes(projects)}
      options={{
        filter: { enabled: true, allLabel: t('common.label.showAll') },
        circleFloatingEdges: true,
        minimap: false,
        zoomOnInit: { level: 1, applyOnLayoutAndFilter: true }
      }}
    />
  );
};

export const mapProjectsToGraphNodes = (projects: ProjectBean[] | undefined): NodeData[] => {
  if (!projects) {
    return [];
  }

  return projects.map(project => ({
    id: project.id.pmv,
    label: project.id.pmv,
    content: `${project.artifactId} - ${project.version}`,
    options: {
      expandContent: true,
      controls: <ProjectGraphControls project={project} />
    },
    target: project.dependencies?.map(dep => ({ id: dep.pmv })) ?? []
  }));
};

const ProjectGraphControls = ({ project }: { project: ProjectBean }) => {
  const navigate = useNavigate();
  const projectUrl = `${project.id.app}/${project.id.pmv}`;
  return <GraphControls openAction={() => navigate(`projects/${projectUrl}`)} />;
};

export const GraphControls = ({ openAction }: { openAction: () => void }) => {
  const { t } = useTranslation();
  return <Button icon={IvyIcons.SubEnd} rotate={180} onClick={openAction} aria-label={t('common.label.open')} />;
};
