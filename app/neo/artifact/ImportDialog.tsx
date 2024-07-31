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
  Flex,
  Input
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { ReactNode, useState } from 'react';

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
            The import cannot be undone. It could overwrite existing projects in {name}. Consider exporting the workspace beforehand.
          </DialogDescription>
        </DialogHeader>
        <Flex direction='column' gap={2}>
          <form id='upload-form' onSubmit={() => (file ? importAction(file) : {})}>
            <Fieldset label='Select an .iar file or a .zip file that contains .iar files'>
              <Input
                required={true}
                accept='.zip,.iar'
                type='file'
                onChange={e => {
                  if (e.target.files && e.target.files.length > 0) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </Fieldset>
          </form>
        </Flex>
        <DialogFooter>
          <Button form='upload-form' type='submit' variant='primary' size='large' icon={IvyIcons.Upload}>
            Import
          </Button>
          <Button variant='primary' size='large' onClick={() => exportAction()} icon={IvyIcons.Download}>
            Export
          </Button>
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
