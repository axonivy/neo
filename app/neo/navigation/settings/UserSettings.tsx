import {
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  IvyIcon,
  toast
} from '@axonivy/ui-components';
import { IvyIcons } from '@axonivy/ui-icons';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { ok } from '~/data/custom-fetch';
import { me } from '~/data/generated/ivy-client';
import { useWorkspace } from '~/data/workspace-api';

export const UserSettings = () => {
  const { t } = useTranslation();
  const ws = useWorkspace();
  const queryKey = ['neo', ws?.id, 'me'];
  const base = ws?.baseUrl;

  const data = useQuery({
    queryKey,
    queryFn: () => {
      if (base === undefined) return;
      return me().then(res => {
        if (ok(res)) {
          return res.data;
        }
        if (res.status === 401) {
          toast.error(t('toast.unauthorized'), {
            duration: Infinity,
            action: { label: t('common.label.reload'), onClick: () => window.location.reload() }
          });
        }
        return;
      });
    }
  });
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <IvyIcon icon={IvyIcons.User} />
        {data?.data?.name}
        <DropdownMenuPortal>
          <DropdownMenuSubContent>
            <DropdownMenuItem onClick={() => (window.location.href = '/go/login')}>
              <IvyIcon icon={IvyIcons.MethodStart} />
              {t('settings.logout')}
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSubTrigger>
    </DropdownMenuSub>
  );
};
