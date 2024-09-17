import { BasicField, BasicSelect, Spinner } from '@axonivy/ui-components';
import { useEffect, useMemo } from 'react';
import { ProjectIdentifier, useProjects } from '~/data/project-api';

type ProjectSelectProps = {
  setProject: (project: ProjectIdentifier) => void;
};

export const ProjectSelect = ({ setProject }: ProjectSelectProps) => {
  const { data, isPending } = useProjects();
  const projects = useMemo(() => data?.filter(p => !p.isIar) ?? [], [data]);
  useEffect(() => setProject(projects[0]), [projects, setProject]);
  return (
    <BasicField label='Project'>
      {isPending ? (
        <Spinner size='small' />
      ) : (
        <BasicSelect
          placeholder={isPending && <Spinner size='small' />}
          items={projects.map(p => ({
            value: JSON.stringify(p),
            label: p.pmv
          }))}
          defaultValue={JSON.stringify(projects[0])}
          onValueChange={value => setProject(JSON.parse(value))}
        />
      )}
    </BasicField>
  );
};
