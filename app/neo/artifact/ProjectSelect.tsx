import { BasicField, BasicSelect, Spinner } from '@axonivy/ui-components';
import { useParams } from '@remix-run/react';
import { useEffect, useMemo } from 'react';
import { ProjectIdentifier, useProjects } from '~/data/project-api';
import { projectSort } from './list-artifacts';

type ProjectSelectProps = {
  setProject: (project: ProjectIdentifier) => void;
};

export const ProjectSelect = ({ setProject }: ProjectSelectProps) => {
  const { data, isPending } = useProjects();
  const { ws } = useParams();
  const projects = useMemo(() => data?.filter(p => !p.isIar).sort((a, b) => projectSort(a.pmv, b.pmv, ws)) ?? [], [data, ws]);
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
