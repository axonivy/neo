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
  DialogFooter,
  DialogClose
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { ProjectIdentifier, useProjects } from '~/data/project-api';
import { useEffect, useState } from 'react';
import { useNewArtifactDialog } from './useNewArtifactDialog';

type ProjectSelectProps = {
  project: ProjectIdentifier | undefined;
  setProject: (project: ProjectIdentifier) => void;
};

const ProjectSelect = ({ project, setProject }: ProjectSelectProps) => {
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
  const { close, dialogState, dialogContext } = useNewArtifactDialog();
  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('Neo');
  const [project, setProject] = useState<ProjectIdentifier>();
  useEffect(() => {
    setName(dialogContext?.defaultName ?? '');
    setProject(dialogContext?.project);
  }, [dialogContext]);
  if (dialogContext === undefined) {
    return null;
  }
  return (
    <Dialog open={dialogState} onOpenChange={() => close()}>
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
          {dialogContext.project ? <></> : <ProjectSelect project={project} setProject={setProject}></ProjectSelect>}
        </Flex>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              icon={IvyIcons.Plus}
              variant='primary'
              onClick={() => dialogContext.create(name, namespace, project, dialogContext.pid)}
            >
              Create
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button icon={IvyIcons.Close} variant='outline'>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
