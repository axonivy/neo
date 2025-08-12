import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IvyIcon,
  useHotkeys
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { useEditors } from '~/neo/editors/useEditors';
import { useKnownHotkeys } from '~/utils/hotkeys';

export const EditorsControl = () => {
  const { editors, closeAllEditors } = useEditors();
  const { t } = useTranslation();
  const { closeAllTabs } = useKnownHotkeys();
  useHotkeys(closeAllTabs.hotkey, () => closeAllEditors(), { scopes: ['neo'] });

  if (editors.length === 0) {
    return null;
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={IvyIcons.Dots} size='large' />
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={6} collisionPadding={10} side='bottom' align='end' style={{ border: 'var(--basic-border)' }}>
        <DropdownMenuItem onClick={() => closeAllEditors()}>
          <IvyIcon icon={IvyIcons.Close} />
          <span>{t('common.label.closeAll')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
