import { toast } from '@axonivy/ui-components';

let unauthorizedCount = 0;

const getUrl = (contextUrl: string, headers?: Record<string, string>): string => {
  const base = headers && headers['base'] ? headers['base'] : '';
  const apiPrefix = '/api';
  if (contextUrl.startsWith(apiPrefix)) {
    return `${base}${contextUrl} `;
  }
  return `${base}${apiPrefix}${contextUrl} `;
};

const xRequestedByHeader = 'X-Requested-By';

const getHeaders = (headersInit?: HeadersInit): HeadersInit => {
  const headers = new Headers(headersInit);
  if (!headers.has(xRequestedByHeader)) {
    headers.append(xRequestedByHeader, 'neo');
  }
  headers.delete('base');
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
  handleUnauthorized(response);
  return { status: response.status, data } as T;
};

const handleUnauthorized = (response: Response) => {
  if (response.status === 401) {
    unauthorizedCount++;
    if (unauthorizedCount > 1) {
      toast.error('Unauthorized, click reload to log in.', {
        duration: Infinity,
        action: { label: 'Reload', onClick: () => window.location.reload() }
      });
    }
    throw new Error(response.statusText);
  }
  unauthorizedCount = 0;
};

export const headers = (base?: string) => {
  return { base: base ?? '' };
};

export const ok = (res: { status: number }) => res.status >= 200 && res.status <= 299;

export const resolveErrorMessage = (data: unknown, message: string) => {
  const error = data as { errorMessage: string };
  if (error.errorMessage) {
    message = `${message}: ${error.errorMessage}`;
  }
  return message;
};

export default customFetch;
