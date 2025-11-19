import { useQuery } from '@tanstack/react-query';
import { useHref } from 'react-router';
import { ok } from './custom-fetch';
import { logoutMe, me1 } from './generated/ivy-client';

export const useUser = () => {
  const redirectToLogin = useRedirectToLogin();
  return useQuery({
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
};

export const useLogout = () => {
  const redirectToLogin = useRedirectToLogin();
  return () =>
    logoutMe().then(() => {
      redirectToLogin();
    });
};

const useRedirectToLogin = () => {
  const currentUrl = useHref('');
  return () => {
    window.location.href = `/go/login?originalUrl=${encodeURIComponent(currentUrl)}`;
  };
};
