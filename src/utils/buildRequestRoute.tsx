import { RequestModel } from '@/models/request.model';

export const buildRequestRoute = (request: RequestModel): string => {
  const params = new URLSearchParams();

  params.set('method', request.method);

  params.set('url', btoa(request.url));

  if (request.body) {
    const bodyString =
      typeof request.body === 'string'
        ? request.body
        : JSON.stringify(request.body);
    params.set('body', btoa(bodyString));
  }

  if (request.headers) {
    Object.entries(request.headers).forEach(([key, value]) => {
      params.set(key, encodeURIComponent(value));
    });
  }

  return `?${params.toString()}`;
};
