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
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ok } from '~/data/custom-fetch';
import { logoutMe, me1, reload } from '~/data/generated/ivy-client';
import { useWorkspace } from '~/data/workspace-api';

export const useUserSettings = () => {
  const ws = useWorkspace();
  return useQuery({
    queryKey: ['neo', ws?.id, 'me'],
    queryFn: async () => {
      const res = await me1();
      return ok(res) ? res.data : null;
    }
  });
};

const UserMenuContent = () => {
  const { t } = useTranslation();

  const logout = () =>
    logoutMe().then(() => {
      window.location.href = '/neo/';
      reload();
    });

  return (
    <DropdownMenuItem onClick={logout}>
      <IvyIcon icon={IvyIcons.MethodStart} />
      {t('settings.logout')}
    </DropdownMenuItem>
  );
};

export const UserSettingsOverview = () => {
  const user = useUserSettings();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label={user?.data?.name} title={user?.data?.name}>
          <IvyIcon icon={IvyIcons.User} />
          {user?.data?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='bottom'>
        <UserMenuContent />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserSettingsNavigation = () => {
  const user = useUserSettings();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <IvyIcon icon={IvyIcons.User} />
        {user?.data?.name}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <UserMenuContent />
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
};
