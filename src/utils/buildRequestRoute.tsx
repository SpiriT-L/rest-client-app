import { RequestModel } from '@/models/request.model';
import { substituteVariables } from './variableSubstitution';
import { Variable } from '@/models/variable';

const safeBtoa = (str: string): string => {
  if (typeof window === 'undefined') {
    return '';
  }

  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

export const buildRequestRoute = (
  request: RequestModel,
  variables: Variable[] = []
): string => {
  const substitutedUrl = substituteVariables(request.url, variables);
  const encodedUrl = safeBtoa(substitutedUrl);

  let encodedBody = '';
  if (request.body) {
    const bodyString =
      typeof request.body === 'string'
        ? request.body
        : JSON.stringify(request.body);
    const substitutedBody = substituteVariables(bodyString, variables);
    encodedBody = `/${safeBtoa(substitutedBody)}`;
  }

  const headerParams = new URLSearchParams();
  if (request.headers) {
    Object.entries(request.headers).forEach(([key, value]) => {
      const substitutedValue = substituteVariables(value, variables);
      headerParams.append(key, substitutedValue);
    });
  }

  let queryString = headerParams.toString();
  if (queryString) {
    queryString = `?${queryString}`;
  }

  return `/${request.method}/${encodedUrl}${encodedBody}${queryString}`;
};
