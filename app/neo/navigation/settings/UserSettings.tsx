import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  IvyIcon
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useTranslation } from 'react-i18next';
import { logout, useUser } from '~/data/user-api';
import { LanguageSettings } from './LanguageSettings';
import { ThemeSettings } from './ThemeSettings';

const UserLogout = () => {
  const { t } = useTranslation();

  return (
    <DropdownMenuItem onClick={logout}>
      <IvyIcon icon={IvyIcons.MethodStart} />
      {t('settings.logout')}
    </DropdownMenuItem>
  );
};

export const UserSettingsOverview = () => {
  const user = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label={user?.data?.name} title={user?.data?.name}>
          <IvyIcon icon={IvyIcons.User} />
          {user?.data?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom'>
        <LanguageSettings />
        <ThemeSettings />
        <UserLogout />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserSettingsNavigation = () => {
  const user = useUser();
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <IvyIcon icon={IvyIcons.User} />
        {user?.data?.name}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <UserLogout />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
