import { BasicDialogContent, Button, Dialog, DialogContent, useDialogHotkeys, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useKnownHotkeys } from '~/utils/hotkeys';

export type DeleteAction = { run: () => void; artifact: string; isDeletable: boolean; message?: string; label?: string };

export const useDeleteConfirmDialog = () => {
  const hotkeys = useKnownHotkeys();
  const { open, onOpenChange } = useDialogHotkeys(['artifactCardActionDialog']);
  const artifactCardRef = useHotkeys([hotkeys.deleteElement.hotkey], () => onOpenChange(true), { keydown: false, keyup: true });
  return { open, onOpenChange, artifactCardRef };
};

type DeleteConfirmProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deleteAction: DeleteAction;
};

export const DeleteConfirmDialog = ({ open, onOpenChange, deleteAction }: DeleteConfirmProps) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <BasicDialogContent
          title={t('artifact.deleteConfirmTitle')}
          description={
            deleteAction.isDeletable ? t('artifact.deleteConfirmMsg', { artifact: deleteAction.artifact }) : deleteAction.message
          }
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
