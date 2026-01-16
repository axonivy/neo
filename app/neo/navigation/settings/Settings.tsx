import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, useHotkeys } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { HOTKEY_ENABLE_ON_FORM_ITEMS, useKnownHotkeys } from '~/utils/hotkeys';
import { useCycleTheme } from './ThemeSettings';

export const Settings = (props: ComponentProps<typeof DropdownMenuContent>) => {
  const { t } = useTranslation();
  const cycleTheme = useCycleTheme();
  const { changeTheme } = useKnownHotkeys();
  useHotkeys(changeTheme.hotkey, cycleTheme, { scopes: ['neo'], enableOnFormTags: HOTKEY_ENABLE_ON_FORM_ITEMS });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={IvyIcons.Settings} size='large' aria-label={t('common.label.settings')} title={t('common.label.settings')} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' {...props} />
    </DropdownMenu>
  );
};
