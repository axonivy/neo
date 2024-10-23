import {
  BasicField,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Flex,
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useParams } from '@remix-run/react';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ProjectIdentifier } from '~/data/project-api';
import { InfoPopover } from '../InfoPopover';
import { ProjectSelect } from './ProjectSelect';
import { validateNotEmpty } from './validation';

export type NewArtifact = {
  type: string;
  namespaceRequired: boolean;
  create: (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) => void;
  project?: ProjectIdentifier;
  pid?: string;
};

type NewArtifactDialogState = {
  open: (context: NewArtifact) => void;
  close: () => void;
  dialogState: boolean;
  newArtifact?: NewArtifact;
};

const NewArtifactDialogContext = createContext<NewArtifactDialogState | undefined>(undefined);

export const NewArtifactDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const { ws } = useParams();
  const [dialogState, setDialogState] = useState(false);
  const [newArtifact, setNewArtifact] = useState<NewArtifact>();

  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('');
  const [project, setProject] = useState<ProjectIdentifier>();

  useEffect(() => {
    setProject(newArtifact?.project);
    setNamespace(newArtifact?.namespaceRequired && ws ? ws : '');
    setName('');
  }, [newArtifact, ws]);

  const open = (context: NewArtifact) => {
    setDialogState(true);
    setNewArtifact(context);
  };
  const close = () => setDialogState(false);
  const nameValidation = useMemo(() => validateNotEmpty(name, 'name', newArtifact?.type.toLowerCase()), [name, newArtifact?.type]);
  const namespaceValidation = useMemo(
    () => (!newArtifact?.namespaceRequired ? undefined : validateNotEmpty(namespace, 'namespace', newArtifact?.type.toLowerCase())),
    [namespace, newArtifact?.namespaceRequired, newArtifact?.type]
  );
  const buttonDisabled = useMemo(
    () => nameValidation !== undefined || namespaceValidation !== undefined,
    [nameValidation, namespaceValidation]
  );
  return (
    <NewArtifactDialogContext.Provider value={{ open, close, dialogState, newArtifact }}>
      {children}
      {newArtifact && name !== undefined && (
        <Dialog open={dialogState} onOpenChange={() => close()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create new {newArtifact.type}</DialogTitle>
            </DialogHeader>
            <form>
              <Flex direction='column' gap={4}>
                <Flex direction='column' gap={3}>
                  <BasicField label='Name' message={nameValidation}>
                    <Input value={name} onChange={e => setName(e.target.value)} />
                  </BasicField>
                  <BasicField
                    label={`Namespace ${newArtifact.namespaceRequired ? '' : ' (Optional)'}`}
                    message={namespaceValidation}
                    control={
                      <InfoPopover info='Namespace organizes and groups elements to prevent naming conflicts, ensuring clarity and efficient project management.' />
                    }
                  >
                    <Input value={namespace} onChange={e => setNamespace(e.target.value)} />
                  </BasicField>
                  {newArtifact.project ? (
                    <></>
                  ) : (
                    <ProjectSelect setProject={setProject} setDefaultValue={true} label='Project' projectFilter={p => !p.id.isIar} />
                  )}
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
                        newArtifact.create(name, namespace, project, newArtifact.pid);
                      }}
                    >
                      Create
                    </Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button icon={IvyIcons.Close} size='large' variant='outline'>
                      Cancel
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

export const useNewArtifact = () => {
  const context = useContext(NewArtifactDialogContext);
  if (context === undefined) throw new Error('useNewArtifactDialog must be used within a NewArtifactDialogProvider');
  return context.open;
};
