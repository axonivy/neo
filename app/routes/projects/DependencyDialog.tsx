import { BasicDialogContent, Button, Dialog, DialogContent, useDialogHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAddDependencyReq } from '~/data/dependency-api';
import type { ProjectBean } from '~/data/generated/ivy-client';
import type { ProjectIdentifier } from '~/data/project-api';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';
import { CreateNewArtefactButton } from '~/neo/overview/Overview';

export const AddDependencyDialog = ({ project }: { project: ProjectIdentifier }) => {
  const { t } = useTranslation();
  const { open, onOpenChange } = useDialogHotkeys(['addDependencyDialog']);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <CreateNewArtefactButton title={t('projects.addDependency')} onClick={() => onOpenChange(true)} />
      <DialogContent>
        <AddDependencyDialogContent project={project} />
      </DialogContent>
    </Dialog>
  );
};

const AddDependencyDialogContent = ({ project }: { project: ProjectIdentifier }) => {
  const { t } = useTranslation();
  const [dependency, setDependency] = useState<ProjectBean>();
  const { addDependency } = useAddDependencyReq();
  return (
    <BasicDialogContent
      title={t('projects.addDependencyTo', { project: project.pmv })}
      description={t('projects.addDependencyDescription')}
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
      submit={
        <Button
          variant='primary'
          size='large'
          disabled={dependency === undefined}
          onClick={() => addDependency(project, dependency?.id)}
          icon={IvyIcons.Plus}
        >
          {t('common.label.add')}
        </Button>
      }
    >
      <ProjectSelect
        onProjectChange={setDependency}
        setDefaultValue={true}
        projectFilter={p => p.id.pmv !== project.pmv}
        label={t('projects.selectDependency')}
      />
    </BasicDialogContent>
  );
};
