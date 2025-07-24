import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IvyIcon
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { type DeleteAction, DeleteConfirmDialog } from './DeleteConfirmDialog';

type ArtifactCardMenuProps = {
  deleteAction: DeleteAction;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children?: ReactNode;
};

export const ArtifactCardMenu = ({ deleteAction, open, onOpenChange, children }: ArtifactCardMenuProps) => {
  const { t } = useTranslation();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button icon={IvyIcons.Dots} />
        </DropdownMenuTrigger>
        <DropdownMenuContent side='bottom' align='start' className='card-menu'>
          <DropdownMenuGroup>
            <DropdownMenuItem className='card-delete' onSelect={() => onOpenChange(true)}>
              <IvyIcon icon={IvyIcons.Trash} />
              <span>{deleteAction.label ?? t('common.label.delete')}</span>
            </DropdownMenuItem>
            {children}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      {open && <DeleteConfirmDialog open={open} onOpenChange={onOpenChange} deleteAction={deleteAction} />}
    </>
  );
};
