const getUrl = (contextUrl: string, headers?: [string, string][]): string => {
  const base = headers && headers.length > 0 ? headers[0] : '';
  return `${base}/api${contextUrl} `;
};

const getHeaders = (headers?: HeadersInit): HeadersInit => {
  return {
    ...headers,
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-By': 'Neo'
  };
};

const getBody = <T>(c: Response | Request): Promise<T> => {
  const contentType = c.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return c.json();
  }
  if (contentType && contentType.includes('application/pdf')) {
    return c.blob() as Promise<T>;
  }
  return c.text() as Promise<T>;
};

export const customFetch = async <T>(url: string, options: RequestInit): Promise<T> => {
  const requestUrl = getUrl(url, options.headers as [string, string][]);
  const requestHeaders = getHeaders(options.headers);
  const requestInit: RequestInit = {
    ...options,
    headers: requestHeaders
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
