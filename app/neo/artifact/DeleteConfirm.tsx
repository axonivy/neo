import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ReactNode } from 'react';

export type DeleteAction = { run: () => void; isDeletable: boolean; message?: string; label?: string };

export const DeleteConfirm = ({ children, title, deleteAction }: { children: ReactNode; title: string; deleteAction: DeleteAction }) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{deleteAction.isDeletable ? `Are you sure you want to delete this ${title}?` : deleteAction.message}</DialogTitle>
      </DialogHeader>
      <DialogFooter>
        {deleteAction.isDeletable && (
          <DialogClose asChild>
            <Button variant='primary' size='large' onClick={deleteAction.run} icon={IvyIcons.Trash}>
              Delete
            </Button>
          </DialogClose>
        )}
        <DialogClose asChild>
          <Button variant='outline' size='large' icon={IvyIcons.Close}>
            Cancel
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
