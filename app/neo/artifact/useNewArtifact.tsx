import {
  BasicField,
  BasicSelect,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Flex,
  Input,
  Spinner
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { useGroupedDataClasses } from '~/data/data-class-api';
import type { DataClassIdentifier, ProjectBean } from '~/data/generated/ivy-client';
import { type ProjectIdentifier } from '~/data/project-api';
import { InfoPopover } from '../InfoPopover';
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
  const { t } = useTranslation();
  const { ws } = useParams();
  const [dialogState, setDialogState] = useState(false);
  const [newArtifact, setNewArtifact] = useState<NewArtifact>();

  const { artifactAlreadyExists, validateArtifactName, validateArtifactNamespace } = useArtifactValidation();

  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [project, setProject] = useState<ProjectBean>();
  const [dataClass, setDataClass] = useState<DataClassIdentifier | undefined>();

  useEffect(() => {
    setProject(newArtifact?.project);
    setName('');
    setDataClass(undefined);
  }, [newArtifact, ws]);

  useEffect(() => {
    setNamespace(newArtifact?.namespaceRequired && project ? project.defaultNamespace : '');
  }, [newArtifact?.namespaceRequired, project]);

  const open = (context: NewArtifact) => {
    setDialogState(true);
    setNewArtifact(context);
  };
  const close = () => setDialogState(false);
  const nameValidation = useMemo(
    () => (newArtifact?.exists({ name, namespace, project: project?.id }) ? artifactAlreadyExists(name) : validateArtifactName(name)),
    [artifactAlreadyExists, name, namespace, newArtifact, project?.id, validateArtifactName]
  );
  const namespaceValidation = useMemo(
    () => validateArtifactNamespace(namespace, newArtifact?.type),
    [namespace, newArtifact?.type, validateArtifactNamespace]
  );
  const buttonDisabled = useMemo(
    () => nameValidation?.variant === 'error' || namespaceValidation?.variant === 'error',
    [nameValidation, namespaceValidation]
  );
  return (
    <NewArtifactDialogContext.Provider value={{ open, close, dialogState, newArtifact }}>
      {children}
      {newArtifact && name !== undefined && (
        <Dialog open={dialogState} onOpenChange={() => close()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('artifact.new', { type: newArtifact.type })}</DialogTitle>
            </DialogHeader>
            <form>
              <Flex direction='column' gap={4}>
                <Flex direction='column' gap={3}>
                  <BasicField label={t('common.label.name')} message={nameValidation}>
                    <Input value={name} onChange={e => setName(e.target.value)} />
                  </BasicField>
                  {newArtifact.project === undefined && (
                    <ProjectSelect
                      setProject={setProject}
                      setDefaultValue={true}
                      label={t('label.project')}
                      projectFilter={p => !p.id.isIar}
                    />
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
                  {newArtifact.selectDataClass && project && <DataClassSelect project={project.id} setDataClass={setDataClass} />}
                </Flex>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      icon={IvyIcons.Plus}
                      disabled={buttonDisabled}
                      variant='primary'
                      size='large'
                      type='submit'
                      onClick={e => {
                        e.preventDefault();
                        setDialogState(false);
                        newArtifact.create(name, namespace, project?.id, newArtifact.pid, dataClass);
                      }}
                    >
                      {t('common.label.create')}
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button icon={IvyIcons.Close} size='large' variant='outline'>
                      {t('common.label.cancel')}
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </Flex>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </NewArtifactDialogContext.Provider>
  );
};

const DataClassSelect = ({ project, setDataClass }: { project: ProjectIdentifier; setDataClass: (d?: DataClassIdentifier) => void }) => {
  const { t } = useTranslation();
  const { data, isPending } = useGroupedDataClasses();
  const dataClasses = useMemo(() => data?.find(g => g.project === project.pmv)?.artifacts ?? [], [data, project.pmv]);
  useEffect(() => setDataClass(undefined), [setDataClass]);
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
          onValueChange={value => setDataClass(JSON.parse(value))}
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
