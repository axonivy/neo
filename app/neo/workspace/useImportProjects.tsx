import {
  BasicField,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  type MessageData
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Link, useParams } from '@remix-run/react';
import { useQueryClient } from '@tanstack/react-query';
import { createContext, useContext, useMemo, useState } from 'react';
import { useProjectsApi, type ProjectIdentifier } from '~/data/project-api';
import { useImportProjectsIntoWs } from '~/data/workspace-api';
import { ProjectSelect } from '../artifact/ProjectSelect';
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
    setFile(undefined);
    setDialogState(true);
  };
  const close = () => {
    setDialogState(false);
  };
  const fileValidation = useMemo<MessageData | undefined>(
    () => (file ? undefined : { message: 'Select an .iar file or a .zip file that contains .iar files.', variant: 'warning' }),
    [file]
  );
  return (
    <ImportProjectsDialogContext.Provider value={{ open, close, dialogState }}>
      {children}
      <Dialog open={dialogState} onOpenChange={() => close()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Axon Ivy Projects into: {ws}</DialogTitle>
            <DialogDescription>
              The import can overwrite existing project versions.{' '}
              <Link onClick={downloadWorkspace} to={{}}>
                Consider exporting the Workspace beforehand.
              </Link>
            </DialogDescription>
          </DialogHeader>
          <BasicField label='File' message={fileValidation}>
            <Input
              accept='.zip,.iar'
              type='file'
              onChange={e => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                }
              }}
            />
          </BasicField>
          <ProjectSelect
            setProject={setProject}
            setDefaultValue={false}
            label='Add as dependency to project'
            projectFilter={p => !p.id.isIar}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant='primary'
                size='large'
                disabled={fileValidation !== undefined}
                onClick={() => (file ? importAction(file) : {})}
                icon={IvyIcons.Download}
              >
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
