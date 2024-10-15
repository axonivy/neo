import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Link, useParams } from '@remix-run/react';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useState } from 'react';
import { useProjectsApi, type ProjectIdentifier } from '~/data/project-api';
import { useImportProjectsIntoWs } from '~/data/workspace-api';
import { ProjectSelect } from '../artifact/ProjectSelect';
import { FileInput } from './FileInput';
import { useDownloadWorkspace } from './useDownloadWorkspace';

type ImportProjectsDialogState = {
  open: () => void;
  close: () => void;
  dialogState: boolean;
};

const ImportProjectsDialogContext = createContext<ImportProjectsDialogState | undefined>(undefined);

export const ImportProjectsDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const { ws } = useParams();
  const [file, setFile] = useState<File>();
  const [dialogState, setDialogState] = useState(false);
  const downloadWorkspace = useDownloadWorkspace();
  const { importProjects } = useImportProjectsIntoWs();
  const { queryKey } = useProjectsApi();
  const client = useQueryClient();
  const [project, setProject] = useState<ProjectIdentifier>();
  const importAction = (file: File) => importProjects(ws ?? '', file, project).then(() => client.invalidateQueries({ queryKey }));
  const open = () => {
    setDialogState(true);
  };
  const close = () => {
    setDialogState(false);
  };
  return (
    <ImportProjectsDialogContext.Provider value={{ open, close, dialogState }}>
      {children}
      <Dialog open={dialogState} onOpenChange={() => close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Axon Ivy Projects into: {ws}</DialogTitle>
            <DialogDescription>
              The import cannot be undone. It could overwrite existing projects in {ws}.{' '}
              <Link onClick={downloadWorkspace} to={{}}>
                Consider exporting the application beforehand.
              </Link>
            </DialogDescription>
          </DialogHeader>
          <FileInput setFile={setFile} />
          <ProjectSelect setProject={setProject} setDefaultValue={false} label='Add as dependency to project'></ProjectSelect>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant='primary' size='large' onClick={() => (file ? importAction(file) : {})} icon={IvyIcons.Download}>
                Import
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
    </ImportProjectsDialogContext.Provider>
  );
};

export const useImportProjects = () => {
  const context = useContext(ImportProjectsDialogContext);
  if (context === undefined) throw new Error('useImportProjects must be used within an ImportProjectsDialogContext');
  return context.open;
};
