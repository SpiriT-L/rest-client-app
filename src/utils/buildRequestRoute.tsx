import { RequestModel } from '@/models/request.model';

export const buildRequestRoute = (request: RequestModel): string => {
  const encodedUrl = btoa(request.url);

  let route = `/${request.method}/${encodedUrl}`;

  if (request.body) {
    const bodyString =
      typeof request.body === 'string'
        ? request.body
        : JSON.stringify(request.body);
    const encodedBody = btoa(bodyString);
    route += `/${encodedBody}`;
  }

  if (request.headers && Object.keys(request.headers).length > 0) {
    const queryParams = Object.entries(request.headers)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    route += `?${queryParams}`;
  }

  return route;
};
