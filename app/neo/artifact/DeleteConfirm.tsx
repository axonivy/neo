import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ReactNode } from 'react';

export const DeleteConfirm = ({ children, title, deleteAction }: { children: ReactNode; title: string; deleteAction: () => void }) => (
  <Dialog>
    <DialogTrigger asChild>{children}</DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Are you sure you want to delete this {title}?</DialogTitle>
      </DialogHeader>
      <DialogFooter>
        <DialogClose asChild>
          <Button variant='primary' size='large' onClick={deleteAction} icon={IvyIcons.Trash}>
            Delete
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
