import {
  Button,
  Flex,
  Input,
  Fieldset,
  BasicSelect,
  Spinner,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { ProjectIdentifier, useProjects } from '~/data/project-api';
import { useNewArtifactDialog } from './useNewArtifactDialog';
import { useEffect, useState } from 'react';

const ProjectSelect = ({
  project,
  setProject
}: {
  project: ProjectIdentifier | undefined;
  setProject: (project: ProjectIdentifier) => void;
}) => {
  const { data, isPending } = useProjects();
  const projects = data ?? [];
  return (
    <Fieldset label='Project'>
      {isPending ? (
        <Spinner size='small' />
      ) : (
        <BasicSelect
          placeholder={isPending && <Spinner size='small' />}
          items={projects.map(p => ({
            value: JSON.stringify(p),
            label: `${p.app}/${p.pmv}`
          }))}
          defaultValue={(() => {
            project ?? setProject(projects[0]);
            return JSON.stringify(projects[0]);
          })()}
          onValueChange={value => setProject(JSON.parse(value))}
        />
      )}
    </Fieldset>
  );
};

export const NewArtifactDialog = () => {
  const { close, openState, dialogContext } = useNewArtifactDialog();
  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('Neo');
  const [project, setProject] = useState<ProjectIdentifier>();
  useEffect(() => {
    if (dialogContext) setName(dialogContext?.defaultName);
  }, [dialogContext]);
  return (
    dialogContext && (
      <Dialog open={openState}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialogContext.title}</DialogTitle>
          </DialogHeader>
          <Flex direction='column' gap={2}>
            <Fieldset label='Name'>
              <Input value={name} onChange={e => setName(e.target.value)} />
            </Fieldset>
            <Fieldset label='Namespace'>
              <Input value={namespace} onChange={e => setNamespace(e.target.value)} />
            </Fieldset>
            <ProjectSelect project={project} setProject={setProject}></ProjectSelect>
          </Flex>
          <DialogFooter>
            <Button
              icon={IvyIcons.Plus}
              variant='primary'
              onClick={() => {
                close();
                dialogContext.create(name, namespace, project);
              }}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  );
};
