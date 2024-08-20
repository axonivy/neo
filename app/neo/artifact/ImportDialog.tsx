import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Fieldset,
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { Link } from '@remix-run/react';
import { ReactNode, useState } from 'react';

export const FileInput = ({ setFile }: { setFile: (file: File) => void }) => (
  <Fieldset label='Select an .iar file or a .zip file that contains .iar files'>
    <Input
      accept='.zip,.iar'
      type='file'
      onChange={e => {
        if (e.target.files && e.target.files.length > 0) {
          setFile(e.target.files[0]);
        }
      }}
    />
  </Fieldset>
);

export const ImportDialog = ({
  children,
  name,
  importAction,
  exportAction
}: {
  children: ReactNode;
  name: string;
  importAction: (file: File) => void;
  exportAction: () => void;
}) => {
  const [file, setFile] = useState<File>();
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Axon Ivy Projects into: {name}</DialogTitle>
          <DialogDescription>
            The import cannot be undone. It could overwrite existing projects in {name}.{' '}
            <Link onClick={exportAction} to={'/'}>
              Consider exporting the workspace beforehand.
            </Link>
          </DialogDescription>
        </DialogHeader>
        <FileInput setFile={setFile} />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='primary' size='large' onClick={() => (file ? importAction(file) : {})} icon={IvyIcons.Upload}>
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
  );
};
