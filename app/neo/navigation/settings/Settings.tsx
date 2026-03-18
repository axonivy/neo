import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import type { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';
import { useCycleThemeHotkey } from './ThemeSettings';

export const Settings = (props: ComponentProps<typeof DropdownMenuContent>) => {
  const { t } = useTranslation();
  useCycleThemeHotkey();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={IvyIcons.Settings} size='large' aria-label={t('common.label.settings')} title={t('common.label.settings')} />
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom' {...props} />
    </DropdownMenu>
  );
};
