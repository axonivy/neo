const BASE = '/neo/api/web-ide/';

export const get = (url: string) => {
  return fetch(`${BASE}${url}`);
};

export const post = (url: string, data: unknown) => {
  return fetch(`${BASE}${url}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-By': 'Neo'
    },
    body: JSON.stringify(data)
  });
};

export const deleteReq = (url: string, data: unknown) => {
  return fetch(`${BASE}${url}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-By': 'Neo'
    },
    body: JSON.stringify(data)
  });
};
