import { BasicDialog, Button } from '@axonivy/ui-components';
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
    <BasicDialog
      open={open}
      onOpenChange={onOpenChange}
      contentProps={{
        title: t('artifact.deleteConfirmTitle'),
        description: deleteAction.isDeletable ? t('artifact.deleteConfirmMsg', { artifact: title }) : deleteAction.message,
        buttonClose: (
          <Button variant='outline' size='large'>
            {t('common.label.cancel')}
          </Button>
        ),
        buttonCustom: (
          <Button variant='primary' size='large' onClick={deleteAction.run}>
            {t('common.label.delete')}
          </Button>
        )
      }}
    ></BasicDialog>
  );
};
