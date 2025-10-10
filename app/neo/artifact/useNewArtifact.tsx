import {
  BasicDialogContent,
  BasicField,
  BasicSelect,
  Button,
  Dialog,
  DialogContent,
  Input,
  Spinner,
  useDialogHotkeys,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { createContext, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDataClasses } from '~/data/data-class-api';
import type { DataClassIdentifier, ProjectBean } from '~/data/generated/ivy-client';
import { type ProjectIdentifier } from '~/data/project-api';
import { InfoPopover } from '~/neo/overview/InfoPopover';
import { ProjectSelect } from './ProjectSelect';
import { useArtifactValidation } from './validation';

export type NewArtifactType = 'Process' | 'Form' | 'Data Class';

export type NewArtifactIdentifier = {
  name: string;
  namespace: string;
  project?: ProjectIdentifier;
};

export type NewArtifact = {
  type: NewArtifactType;
  namespaceRequired: boolean;
  create: (name: string, namespace: string, project?: ProjectIdentifier, pid?: string, dataClass?: DataClassIdentifier) => void;
  exists: ({ name, namespace, project }: NewArtifactIdentifier) => boolean;
  project?: ProjectBean;
  pid?: string;
  selectDataClass?: boolean;
};

type NewArtifactDialogState = {
  open: (context: NewArtifact) => void;
  close: () => void;
  dialogState: boolean;
  newArtifact?: NewArtifact;
};

const NewArtifactDialogContext = createContext<NewArtifactDialogState | undefined>(undefined);

export const NewArtifactDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const { open: dialogState, onOpenChange: onDialogOpenChange } = useDialogHotkeys(['newArtifactDialog']);

  const [newArtifact, setNewArtifact] = useState<NewArtifact>();

  const open = (context: NewArtifact) => {
    onDialogOpenChange(true);
    setNewArtifact(context);
  };
  const close = () => onDialogOpenChange(false);

  return (
    <NewArtifactDialogContext.Provider value={{ open, close, dialogState, newArtifact }}>
      {children}
      <Dialog open={dialogState} onOpenChange={onDialogOpenChange}>
        <DialogContent>{newArtifact && <NewArtifactDialogContent newArtifact={newArtifact} close={close} />}</DialogContent>
      </Dialog>
    </NewArtifactDialogContext.Provider>
  );
};

const NewArtifactDialogContent = ({ newArtifact, close }: { newArtifact: NewArtifact; close: () => void }) => {
  const { t } = useTranslation();
  const description = useDescription(newArtifact.type);
  const [name, setName] = useState('');
  const [project, setProject] = useState<ProjectBean | undefined>(newArtifact.project);
  const [namespace, setNamespace] = useState<string | undefined>(
    newArtifact.namespaceRequired && project ? project.defaultNamespace : undefined
  );
  const [dataClass, setDataClass] = useState<DataClassIdentifier>();
  if (newArtifact.namespaceRequired && namespace === undefined && project?.defaultNamespace) {
    setNamespace(project.defaultNamespace);
  }

  const { artifactAlreadyExists, validateArtifactName, validateArtifactNamespace } = useArtifactValidation();
  const nameValidation = newArtifact.exists({ name, namespace: namespace ?? '', project: project?.id })
    ? artifactAlreadyExists(name)
    : validateArtifactName(name);
  const namespaceValidation = validateArtifactNamespace(namespace, newArtifact.type);
  const hasErros = nameValidation?.variant === 'error' || namespaceValidation?.variant === 'error';
  const createNewArtifact = () => {
    if (newArtifact && !hasErros) {
      close();
      newArtifact.create(name, namespace ?? '', project?.id, newArtifact.pid, dataClass);
    }
  };
  const enter = useHotkeys('Enter', createNewArtifact, { scopes: ['newArtifactDialog'], enableOnFormTags: true });
  return (
    <BasicDialogContent
      title={t('artifact.newTitle', { type: newArtifact.type })}
      description={description}
      cancel={
        <Button size='large' variant='outline'>
          {t('common.label.cancel')}
        </Button>
      }
      submit={
        <Button icon={IvyIcons.Plus} disabled={hasErros} variant='primary' size='large' onClick={createNewArtifact}>
          {t('common.label.create')}
        </Button>
      }
      ref={enter}
      tabIndex={-1}
    >
      <BasicField label={t('common.label.name')} message={nameValidation}>
        <Input value={name} onChange={e => setName(e.target.value)} />
      </BasicField>
      {newArtifact.project === undefined && (
        <ProjectSelect onProjectChange={setProject} setDefaultValue={true} label={t('label.project')} projectFilter={p => !p.id.isIar} />
      )}
      <BasicField
        label={`${t('artifact.namespace')} ${newArtifact.namespaceRequired ? '' : t('artifact.optional')}`}
        message={namespaceValidation}
        control={
          <InfoPopover info='Namespace organizes and groups elements to prevent naming conflicts, ensuring clarity and efficient project management.' />
        }
      >
        <Input value={namespace} onChange={e => setNamespace(e.target.value)} />
      </BasicField>
      {newArtifact.selectDataClass && project && <DataClassSelect project={project.id} onDataClassChange={setDataClass} />}
    </BasicDialogContent>
  );
};

const DataClassSelect = ({
  project,
  onDataClassChange
}: {
  project: ProjectIdentifier;
  onDataClassChange: (d?: DataClassIdentifier) => void;
}) => {
  const { t } = useTranslation();
  const [dataClass, setDataClass] = useState<DataClassIdentifier>();
  const { data, isPending } = useDataClasses();
  const dataClasses = useMemo(() => data?.filter(dc => dc.dataClassIdentifier.project.pmv === project.pmv) ?? [], [data, project.pmv]);
  const changeDataClass = (dataClass?: DataClassIdentifier) => {
    setDataClass(dataClass);
    onDataClassChange(dataClass);
  };
  return (
    <BasicField label={t('artifact.callerData')}>
      {isPending ? (
        <Spinner size='small' />
      ) : (
        <BasicSelect
          placeholder={isPending && <Spinner size='small' />}
          items={dataClasses.map(d => ({
            value: JSON.stringify(d.dataClassIdentifier),
            label: d.simpleName
          }))}
          value={JSON.stringify(dataClass)}
          onValueChange={value => changeDataClass(JSON.parse(value))}
        />
      )}
    </BasicField>
  );
};

export const useNewArtifact = () => {
  const context = useContext(NewArtifactDialogContext);
  if (context === undefined) throw new Error('useNewArtifactDialog must be used within a NewArtifactDialogProvider');
  return context.open;
};

const useDescription = (type: NewArtifactType) => {
  const { t } = useTranslation();
  switch (type) {
    case 'Data Class':
      return t('artifact.newDataClass');
    case 'Form':
      return t('artifact.newForm');
    case 'Process':
      return t('artifact.newProcess');
    default:
      return '';
  }
};
