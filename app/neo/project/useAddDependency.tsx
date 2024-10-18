import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { createContext, useContext, useState } from 'react';
import { useAddDependencyReq } from '~/data/dependency-api';
import { type ProjectIdentifier } from '~/data/project-api';
import { ProjectSelect } from '../artifact/ProjectSelect';

type AddDependencyDialogState = {
  open: (project: ProjectIdentifier) => void;
  close: () => void;
  dialogState: boolean;
};

const AddDependencyDialogContext = createContext<AddDependencyDialogState | undefined>(undefined);

export const AddDependencyDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogState, setDialogState] = useState(false);
  const [project, setProject] = useState<ProjectIdentifier>();
  const [dependency, setDependency] = useState<ProjectIdentifier>();
  const open = (project: ProjectIdentifier) => {
    setDialogState(true);
    setProject(project);
  };
  const close = () => setDialogState(false);
  const { addDependency } = useAddDependencyReq();
  return (
    <AddDependencyDialogContext.Provider value={{ open, close, dialogState }}>
      {children}
      <Dialog open={dialogState} onOpenChange={() => close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add dependency to: {project?.pmv}</DialogTitle>
          </DialogHeader>
          <ProjectSelect
            setProject={setDependency}
            setDefaultValue={true}
            projectFilter={p => p.id.pmv !== project?.pmv}
            label='Select dependency'
          ></ProjectSelect>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant='primary'
                size='large'
                onClick={() => project && dependency && addDependency(project, dependency)}
                icon={IvyIcons.Plus}
              >
                Add
              </Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant='outline' size='large' icon={IvyIcons.Close}>
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AddDependencyDialogContext.Provider>
  );
};

export const useAddDependency = () => {
  const context = useContext(AddDependencyDialogContext);
  if (context === undefined) throw new Error('useAddDependency must be used within an AddDependencyDialogContext');
  return context.open;
};
