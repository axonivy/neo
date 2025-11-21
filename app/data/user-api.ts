import { useQuery } from '@tanstack/react-query';
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
      redirectToLogin();
      return null;
    },
    refetchInterval: 3 * 60 * 1000,
    refetchOnWindowFocus: true
  });

export const useLogout = () => {
  return () =>
    logoutMe().then(() => {
      redirectToLogin();
    });
};

const redirectToLogin = () => {
  window.location.href = `/go/login?originalUrl=${encodeURIComponent(window.location.pathname)}`;
};
