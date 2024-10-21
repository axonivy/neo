import { BasicField, BasicSelect, Spinner } from '@axonivy/ui-components';
import { useEffect, useMemo } from 'react';
import type { ProjectBean } from '~/data/generated/openapi-dev';
import { type ProjectIdentifier, useSortedProjects } from '~/data/project-api';

type ProjectSelectProps = {
  project?: ProjectIdentifier;
  setProject: (project?: ProjectIdentifier) => void;
  setDefaultValue: boolean;
  label: string;
  projectFilter: (project: ProjectBean) => boolean;
};

export const ProjectSelect = ({ setProject, setDefaultValue, label, projectFilter }: ProjectSelectProps) => {
  const { data, isPending } = useSortedProjects();
  const projects = useMemo(() => data?.filter(p => projectFilter(p)).map(p => p.id) ?? [], [data, projectFilter]);
  const defaultValue = useMemo(
    () => (setDefaultValue ? (projects.length > 0 ? projects[0] : undefined) : undefined),
    [projects, setDefaultValue]
  );
  useEffect(() => setProject(defaultValue), [defaultValue, setProject]);
  return (
    <BasicField label={label}>
      {isPending ? (
        <Spinner size='small' />
      ) : (
        <BasicSelect
          placeholder={isPending && <Spinner size='small' />}
          items={projects.map(p => ({
            value: JSON.stringify(p),
            label: p.pmv
          }))}
          defaultValue={setDefaultValue ? JSON.stringify(projects[0]) : undefined}
          onValueChange={value => setProject(JSON.parse(value))}
        />
      )}
    </BasicField>
  );
};
