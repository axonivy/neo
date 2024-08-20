import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Fieldset,
  Flex,
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { createContext, useContext, useEffect, useState } from 'react';
import { ProjectIdentifier } from '~/data/project-api';
import { ProjectSelect } from './ProjectSelect';

export type NewArtifact = {
  title: string;
  defaultName: string;
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
  const [dialogState, setDialogState] = useState(false);
  const [newArtifact, setNewArtifact] = useState<NewArtifact>();

  const [name, setName] = useState('');
  const [namespace, setNamespace] = useState('neo');
  const [project, setProject] = useState<ProjectIdentifier>();

  useEffect(() => {
    setName(newArtifact?.defaultName ?? '');
    setProject(newArtifact?.project);
  }, [newArtifact]);

  const open = (context: NewArtifact) => {
    setDialogState(true);
    setNewArtifact(context);
  };
  const close = () => setDialogState(false);
  return (
    <NewArtifactDialogContext.Provider value={{ open, close, dialogState, newArtifact }}>
      {children}
      {newArtifact && (
        <Dialog open={dialogState} onOpenChange={() => close()}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{newArtifact.title}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={e => {
                e.preventDefault();
                newArtifact.create(name, namespace, project, newArtifact.pid);
                close();
              }}
            >
              <Flex direction='column' gap={3}>
                <Fieldset label='Name'>
                  <Input value={name} onChange={e => setName(e.target.value)} />
                </Fieldset>
                <Fieldset label='Namespace'>
                  <Input value={namespace} onChange={e => setNamespace(e.target.value)} />
                </Fieldset>
                {newArtifact.project ? <></> : <ProjectSelect setProject={setProject} />}
                <button style={{ display: 'none' }} type='submit'>
                  Create
                </button>
              </Flex>
            </form>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  icon={IvyIcons.Plus}
                  variant='primary'
                  size='large'
                  onClick={() => newArtifact.create(name, namespace, project, newArtifact.pid)}
                >
                  Create
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button icon={IvyIcons.Close} size='large' variant='outline' type='submit'>
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
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
