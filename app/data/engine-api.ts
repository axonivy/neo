const API_URL = '/api/web-ide/';

type ApiProps = { url: string; base?: string };
type ApiDataProps = ApiProps & { data: unknown };

const apiUrl = ({ url, base }: ApiProps) => {
  return `${base ?? ''}${API_URL}${url}`;
};

export const get = (api: ApiProps) => {
  return fetch(apiUrl(api));
};

export const post = ({ data, ...api }: ApiDataProps) => {
  return fetch(apiUrl(api), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'X-Requested-By': 'Neo'
    },
    body: stringify(data)
  });
};

export const deleteReq = ({ data, ...api }: ApiDataProps) => {
  return fetch(apiUrl(api), {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-By': 'Neo'
    },
    body: stringify(data)
  });
};

function stringify(data: unknown) {
  return typeof data === 'string' ? data : JSON.stringify(data);
}
