import { toast } from '@axonivy/ui-components';
import { useQuery } from '@tanstack/react-query';
import i18next from 'i18next';
import { ok } from './custom-fetch';
import { logoutMe, me1 } from './generated/ivy-client';

export const useUser = () =>
  useQuery({
    queryKey: ['neo', 'me'],
    queryFn: async () => {
      const res = await me1();
      if (ok(res) && res.data?.name) {
        return res.data;
      }
      toast.error(i18next.t('toast.unauthorized'), {
        duration: Infinity,
        toasterId: 'endless',
        action: { label: i18next.t('common.label.reload'), onClick: () => redirectToLogin() }
      });
      return null;
    },
    refetchInterval: 3 * 60 * 1000,
    refetchOnWindowFocus: true
  });

export const logout = () => {
  logoutMe().then(() => {
    redirectToLogin();
  });
};

const redirectToLogin = () => {
  window.location.href = '/go/login?originalUrl=/neo/';
  window.location.reload();
};
