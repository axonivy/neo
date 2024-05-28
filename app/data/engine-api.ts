const BASE = '/api/web-ide/';

export const get = (url: string) => {
  return fetch(`${BASE}${url}`);
};
