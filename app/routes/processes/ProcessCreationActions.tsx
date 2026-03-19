import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Flex, IvyIcon } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useCaseMaps, useCreateCaseMap } from '~/data/casemap-api';
import { useCreateProcess, useProcesses } from '~/data/process-api';
import type { ProjectIdentifier } from '~/data/project-api';
import { useNewArtifact, type NewArtifactIdentifier } from '~/neo/artifact/useNewArtifact';
import { useCreateEditor } from '~/neo/editors/useCreateEditor';
import { useEditors } from '~/neo/editors/useEditors';
import { CreateNewArtefactButton } from '~/neo/overview/Overview';
import { ImportBpmnDialog } from './ImportBpmnDialog';
import './ProcessCreationActions.css';

export const useProcessExists = () => {
  const { data } = useProcesses();
  return ({ name, namespace, project }: NewArtifactIdentifier) =>
    data
      ?.filter(process => process.processIdentifier.project.pmv === project?.pmv)
      ?.some(process => process.name.toLowerCase() === name.toLowerCase() && process.namespace.toLowerCase() === namespace.toLowerCase()) ??
    false;
};

export const useCaseMapExists = () => {
  const { data } = useCaseMaps();
  return ({ name, project }: NewArtifactIdentifier) =>
    data
      ?.filter(caseMap => caseMap.caseMapIdentifier.project.pmv === project?.pmv)
      ?.some(caseMap => caseMap.name.toLowerCase() === name.toLowerCase()) ?? false;
};

const NewProcessButton = () => {
  const { t } = useTranslation();
  const open = useNewArtifact();
  const { createProcess } = useCreateProcess();
  const { openEditor } = useEditors();
  const { createProcessEditor } = useCreateEditor();
  const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
    createProcess({ name, namespace, kind: 'Business Process', project }).then(process => openEditor(createProcessEditor(process)));
  const exists = useProcessExists();
  return (
    <CreateNewArtefactButton
      title={t('processes.newProcess')}
      onClick={() => open({ create, exists, type: 'Process', namespaceRequired: false })}
      className='new-process-button'
    />
  );
};

const useOpenCreateCaseMap = () => {
  const open = useNewArtifact();
  const { createCaseMap } = useCreateCaseMap();
  const { openEditor } = useEditors();
  const { createCaseMapEditor } = useCreateEditor();
  const exists = useCaseMapExists();

  const openCreateCaseMap = () => {
    const create = (name: string, namespace: string, project?: ProjectIdentifier) =>
      createCaseMap({ name, namespace, project }).then(caseMap => openEditor(createCaseMapEditor(caseMap)));
    open({ create, exists, type: 'Case Map', namespaceRequired: true });
  };

  return { openCreateCaseMap };
};
export const ProcessCreationActions = () => {
  const { t } = useTranslation();
  const { openCreateCaseMap } = useOpenCreateCaseMap();
  return (
    <Flex>
      <NewProcessButton />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='primary-outline' icon={IvyIcons.Chevron} size='xl' className='additional-actions-trigger' />
        </DropdownMenuTrigger>
        <DropdownMenuContent sideOffset={6} collisionPadding={10} side='bottom' align='end' style={{ border: 'var(--basic-border)' }}>
          <DropdownMenuItem onSelect={e => e.preventDefault()} onClick={openCreateCaseMap}>
            <IvyIcon icon={IvyIcons.Plus} />
            <span>{t('processes.newCaseMap')}</span>
          </DropdownMenuItem>
          <ImportBpmnDialog>
            <DropdownMenuItem onSelect={e => e.preventDefault()}>
              <IvyIcon icon={IvyIcons.Download} />
              <span>{t('processes.bpmn.import')}</span>
            </DropdownMenuItem>
          </ImportBpmnDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </Flex>
  );
};
