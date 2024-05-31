const BASE = '/neo/api/web-ide/';

export const get = (url: string) => {
  return fetch(`${BASE}${url}`);
};
