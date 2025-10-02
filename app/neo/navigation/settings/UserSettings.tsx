import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  IvyIcon
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ok } from '~/data/custom-fetch';
import { logoutMe, me1 } from '~/data/generated/ivy-client';
import { useWorkspace } from '~/data/workspace-api';

export const UserSettings = () => {
  const { t } = useTranslation();
  const ws = useWorkspace();
  const queryKey = ['neo', ws?.id, 'me'];
  const data = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await me1();
      if (ok(res)) {
        return res.data;
      }
      return null;
    }
  });

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <IvyIcon icon={IvyIcons.User} />
        {data?.data?.name}
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => logoutMe().then(() => (window.location.href = '/neo/'))}>
              <IvyIcon icon={IvyIcons.MethodStart} />
              {t('settings.logout')}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSubTrigger>
    </DropdownMenuSub>
  );
};
