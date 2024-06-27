import { createContext, useContext, useState } from 'react';
import { ProjectIdentifier } from '~/data/project-api';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Flex,
  Fieldset,
  Input,
  DialogFooter,
  DialogClose,
  Button
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { ProjectSelect } from './ProjectSelect';

export type NewArtifact = {
  title: string;
  defaultName: string;
  create: (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) => string | number;
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
  const [namespace, setNamespace] = useState('Neo');
  const [project, setProject] = useState<ProjectIdentifier>();

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
            <Flex direction='column' gap={2}>
              <Fieldset label='Name'>
                <Input value={name} onChange={e => setName(e.target.value)} />
              </Fieldset>
              <Fieldset label='Namespace'>
                <Input value={namespace} onChange={e => setNamespace(e.target.value)} />
              </Fieldset>
              {newArtifact.project ? <></> : <ProjectSelect setProject={setProject} />}
            </Flex>
            <DialogFooter>
              <DialogClose asChild>
                <Button
                  icon={IvyIcons.Plus}
                  variant='primary'
                  onClick={() => newArtifact.create(name, namespace, project, newArtifact.pid)}
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
      )}
    </NewArtifactDialogContext.Provider>
  );
};

export const useNewArtifact = () => {
  const context = useContext(NewArtifactDialogContext);
  if (context === undefined) throw new Error('useNewArtifactDialog must be used within a NewArtifactDialogProvider');
  return context.open;
};
