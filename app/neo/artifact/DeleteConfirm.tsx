import { BasicDialogContent, Button, Dialog, DialogContent } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';

export type DeleteAction = { run: () => void; isDeletable: boolean; message?: string; label?: string };

type DeleteConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  deleteAction: DeleteAction;
};

export const DeleteConfirm = ({ open, onOpenChange, title, deleteAction }: DeleteConfirmProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <BasicDialogContent
          title={t('artifact.deleteConfirmTitle')}
          description={deleteAction.isDeletable ? t('artifact.deleteConfirmMsg', { artifact: title }) : deleteAction.message}
          cancel={
            <Button variant='outline' size='large'>
              {t('common.label.cancel')}
            </Button>
          }
          submit={
            <Button variant='primary' size='large' onClick={deleteAction.run} icon={IvyIcons.Trash} disabled={!deleteAction.isDeletable}>
              {deleteAction.label ?? t('common.label.delete')}
            </Button>
          }
        />
      </DialogContent>
    </Dialog>
  );
};
