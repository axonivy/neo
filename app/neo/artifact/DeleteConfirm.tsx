import { Button, Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';

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
}) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{deleteAction.isDeletable ? t('artifact.deleteConfirm', { artifact: title }) : deleteAction.message}</DialogTitle>
        </DialogHeader>
        <DialogFooter>
          {deleteAction.isDeletable && (
            <DialogClose asChild>
              <Button variant='primary' size='large' onClick={deleteAction.run} icon={IvyIcons.Trash}>
                {t('common.delete')}
              </Button>
            </DialogClose>
          )}
          <DialogClose asChild>
            <Button variant='outline' size='large' icon={IvyIcons.Close}>
              {t('common.cancel')}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
