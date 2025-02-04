import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';

export type DeleteAction = { run: () => void; isDeletable: boolean; message?: string; label?: string };

export const DeleteConfirm = ({
  open,
  onOpenChange,
  title,
  deleteAction
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  deleteAction: DeleteAction;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
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
