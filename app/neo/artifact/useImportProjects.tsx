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
import { createContext, useContext, useState } from 'react';
import { useImportWorkspace } from '~/data/workspace-api';
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
  const { downloadWorkspace } = useDownloadWorkspace();
  const { importWorkspace } = useImportWorkspace();
  const importAction = (file: File) => importWorkspace(ws ?? '', file, file.name);
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
