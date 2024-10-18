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
import { createContext, useContext, useEffect, useState } from 'react';
import type { ProjectIdentifier } from '~/data/project-api';
import { ProjectSelect } from './ProjectSelect';

export type NewArtifact = {
  title: string;
  defaultName: string;
  create: (name: string, namespace: string, project?: ProjectIdentifier, pid?: string) => void;
  defaultNamesapce?: string;
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

  const [name, setName] = useState<string>();
  const [namespace, setNamespace] = useState('');
  const [project, setProject] = useState<ProjectIdentifier>();

  useEffect(() => {
    setName(newArtifact?.defaultName ?? undefined);
    setProject(newArtifact?.project);
    setNamespace(newArtifact?.defaultNamesapce ?? ws ?? '');
  }, [newArtifact, ws]);

  const open = (context: NewArtifact) => {
    setDialogState(true);
    setNewArtifact(context);
  };
  const close = () => {
    setDialogState(false);
    setName(undefined);
  };
  return (
    <NewArtifactDialogContext.Provider value={{ open, close, dialogState, newArtifact }}>
      {children}
      {newArtifact && name !== undefined && (
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
                <BasicField label='Name'>
                  <Input value={name} onChange={e => setName(e.target.value)} />
                </BasicField>
                <BasicField label='Namespace'>
                  <Input value={namespace} onChange={e => setNamespace(e.target.value)} />
                </BasicField>
                {newArtifact.project ? (
                  <></>
                ) : (
                  <ProjectSelect setProject={setProject} setDefaultValue={true} label='Project' projectFilter={p => !p.id.isIar} />
                )}
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
