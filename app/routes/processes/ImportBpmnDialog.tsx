import {
  type MessageData,
  BasicDialogContent,
  BasicField,
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Input,
  useDialogHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import type { ProjectBean } from '~/data/generated/ivy-client';
import { useImportBpmnFile } from '~/data/process-api';
import { ProjectSelect } from '~/neo/artifact/ProjectSelect';

export const ImportBpmnDialog = () => {
  const { t } = useTranslation();
  const { open, onOpenChange } = useDialogHotkeys(['importBpmnDialog']);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button icon={IvyIcons.Download} onClick={() => onOpenChange(true)} size='xl' variant='primary-outline'>
          {t('processes.bpmn.import')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <ImportBpmnDialogContent />
      </DialogContent>
    </Dialog>
  );
};

const ImportBpmnDialogContent = () => {
  const { ws } = useParams();
  const { t } = useTranslation();
  const [file, setFile] = useState<File>();
  const { importBpmnFile } = useImportBpmnFile();
  const [project, setProject] = useState<ProjectBean>();
  const importAction = (file: File) => {
    if (!project) {
      return;
    }
    importBpmnFile(project.id, file);
  };
  const fileValidation = useMemo<MessageData | undefined>(
    () => (file ? undefined : { message: t('message.invalidBpmn'), variant: 'warning' }),
    [file, t]
  );

  return (
    <BasicDialogContent
      title={t('processes.bpmn.import', { workspace: ws })}
      description={t('processes.bpmn.importDescription')}
      submit={
        <Button
          variant='primary'
          size='large'
          disabled={fileValidation !== undefined}
          onClick={() => (file ? importAction(file) : {})}
          icon={IvyIcons.Download}
        >
          {t('common.label.import')}
        </Button>
      }
      cancel={
        <Button variant='outline' size='large'>
          {t('common.label.cancel')}
        </Button>
      }
    >
      <BasicField label={t('common.label.file')} message={fileValidation}>
        <Input
          accept='.xml,.bpmn'
          type='file'
          onChange={e => {
            if (e.target.files && e.target.files.length > 0) {
              setFile(e.target.files[0]);
            }
          }}
        />
      </BasicField>
      <ProjectSelect onProjectChange={setProject} setDefaultValue={true} label={t('label.project')} projectFilter={p => !p.id.isIar} />
    </BasicDialogContent>
  );
};
