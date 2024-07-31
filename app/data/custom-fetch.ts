const getUrl = (contextUrl: string, headers?: Record<string, string>): string => {
  const base = headers && headers['base'] ? headers['base'] : '';
  return `${base}/api${contextUrl} `;
};

const getHeaders = (headersInit?: HeadersInit): HeadersInit => {
  const headers = new Headers(headersInit);
  headers.append('X-Requested-By', 'Neo');
  // multipart/form-data should not be set in fetch -> see https://github.com/orval-labs/orval/issues/1531
  if (headers.get('Content-Type') === 'multipart/form-data') {
    headers.delete('Content-Type');
  }
  return headers;
};

const getBody = <T>(c: Response | Request): Promise<T> => {
  const contentType = c.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return c.json();
  }
  if (contentType && contentType.includes('application/octet-stream')) {
    return c.blob() as Promise<T>;
  }
  return c.text() as Promise<T>;
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const requestUrl = getUrl(url, options.headers as Record<string, string>);
  const headers = getHeaders(options.headers);
  const requestInit: RequestInit = {
    ...options,
    headers
  };
  const request = new Request(requestUrl, requestInit);
  const response = await fetch(request);
  const data = await getBody<T>(response);
  return { status: response.status, data } as T;
};

export const headers = (base?: string) => {
  return { base: base ?? '' };
};

export const ok = (res: { status: number }) => res.status >= 200 && res.status <= 299;

export default customFetch;
