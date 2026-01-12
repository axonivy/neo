import {
  BasicDialogContent,
  BasicField,
  Button,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Dialog,
  DialogContent,
  Flex,
  Input,
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateProject, useSortedProjects } from '~/data/project-api';
import { useWorkspaces } from '~/data/workspace-api';
import { useArtifactValidation } from '~/neo/artifact/validation';
import { CreateNewArtefactButton } from '~/neo/overview/Overview';

export const CreateNewProjectButton = () => {
  const { t } = useTranslation();
  const { open, onOpenChange } = useDialogHotkeys(['newProjectDialog']);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CreateNewArtefactButton title={t('workspaces.newProject')} onClick={() => onOpenChange(true)} />
      <DialogContent>
        <NewProjectContent closeDialog={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export const nameChangeHandler = (newProjectName: string, itemName: string, separator: string) => {
  if (!newProjectName) {
    return '';
  }
  const regExp: RegExp = /[^a-zA-Z0-9]/g;
  const response = newProjectName.toLowerCase().replace(regExp, separator);
  if (!itemName) {
    return response;
  }
  const cleanNewProjectName = newProjectName.toLowerCase().replace(regExp, '').slice(0, -1);
  const cleanItemName = itemName.toLowerCase().replace(regExp, '').slice(0, cleanNewProjectName.length);
  if (cleanNewProjectName === cleanItemName) {
    return response;
  }
  return undefined;
};

export const NewProjectContent = ({ closeDialog }: { closeDialog: () => void }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [projectId, setProjectId] = useState('');
  const { artifactAlreadyExists, validateProjectDetails } = useArtifactValidation();
  const workspaces = useWorkspaces();
  const { data } = useSortedProjects();
  const { createProject } = useCreateProject();
  const create = () => createProject({ name: name, groupId: groupId, projectId: projectId });
  const nameValidation = useMemo(
    () =>
      workspaces.data?.find(w => w.name.toLowerCase() === name.toLowerCase())
        ? artifactAlreadyExists(name)
        : validateProjectDetails(name, '-', true),
    [artifactAlreadyExists, name, validateProjectDetails, workspaces.data]
  );
  const projectIdValidation = useMemo(
    () =>
      data?.find(p => p.artifactId.toLowerCase() === projectId.toLowerCase())
        ? artifactAlreadyExists(projectId)
        : validateProjectDetails(projectId, '-'),
    [artifactAlreadyExists, data, projectId, validateProjectDetails]
  );
  const groupIdValidation = useMemo(
    () =>
      data?.find(p => p.groupId.toLowerCase() === groupId.toLowerCase())
        ? artifactAlreadyExists(groupId)
        : validateProjectDetails(groupId, '.'),
    [artifactAlreadyExists, data, groupId, validateProjectDetails]
  );

  const hasErros = useMemo(
    () => nameValidation?.variant === 'error' || projectIdValidation?.variant === 'error' || groupIdValidation?.variant === 'error',
    [nameValidation, projectIdValidation, groupIdValidation]
  );

  const createNewProject = () => {
    if (!hasErros) {
      closeDialog();
      create();
    }
  };

  const enter = useHotkeys('Enter', createNewProject, { scopes: ['newProjectDialog'], enableOnFormTags: true });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    const updatedProjectId = nameChangeHandler(newName, projectId, '-');
    const updatedGroupId = nameChangeHandler(newName, groupId, '.');

    setProjectId(updatedProjectId ?? projectId);
    setGroupId(updatedGroupId ?? groupId);
    setName(newName);
  };

  return (
    <BasicDialogContent
      title={t('workspaces.newProject')}
      description={t('workspaces.newProjectDescription')}
      cancel={
        <Button size='large' variant='outline'>
          {t('common.label.cancel')}
        </Button>
      }
      submit={
        <Button disabled={hasErros} icon={IvyIcons.Plus} size='large' variant='primary' onClick={createNewProject}>
          {t('common.label.create')}
        </Button>
      }
      ref={enter}
      tabIndex={-1}
    >
      <BasicField label={t('project.name')} message={nameValidation}>
        <Input aria-label={t('project.name')} value={name} onChange={handleNameChange} />
      </BasicField>
      <Collapsible>
        <CollapsibleTrigger> {t('artifact.optional')}</CollapsibleTrigger>
        <CollapsibleContent>
          <Flex direction='column' gap={3}>
            <BasicField label={t('project.groupId')} message={groupIdValidation}>
              <Input
                aria-label={t('project.groupId')}
                value={groupId}
                onChange={e => setGroupId(e.target.value)}
                style={groupId === name ? { color: 'grey' } : {}}
              />
            </BasicField>
            <BasicField label={t('project.projectId')} message={projectIdValidation}>
              <Input
                aria-label={t('project.projectId')}
                value={projectId}
                onChange={e => setProjectId(e.target.value)}
                style={projectId === name ? { color: 'grey' } : {}}
              />
            </BasicField>
          </Flex>
        </CollapsibleContent>
      </Collapsible>
    </BasicDialogContent>
  );
};
