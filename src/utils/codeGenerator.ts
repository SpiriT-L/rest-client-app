import { RestClientState } from '@/models/rest-client';
import { Variable } from '@/models/variable';
import { codeTemplates } from './codeTemplates';
import { substituteVariables } from './variableSubstitution';

export const escapeString = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
};

export const formatJson = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch {
    return json;
  }
};

export const validateJson = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
};

export const prepareBodyForLanguage = (
  body: string,
  language: string
): string => {
  if (!body) return '';

  const formattedBody = formatJson(body);

  if (language === 'curl') {
    return formattedBody;
  }

  return formattedBody;
};

export const generateCode = (
  state: RestClientState,
  variables: Variable[],
  language: string
): string => {
  const { method, url, headers, body } = state;

  const substitutedUrl = substituteVariables(url, variables);
  const substitutedHeaders = headers.map(header => ({
    key: substituteVariables(header.key, variables),
    value: substituteVariables(header.value, variables),
  }));
  const substitutedBody = body ? substituteVariables(body, variables) : '';

  if (substitutedBody && !validateJson(substitutedBody)) {
    throw new Error('Invalid JSON in request body');
  }

  const escapedUrl = escapeString(substitutedUrl);
  const escapedHeaders = substitutedHeaders.map(header => ({
    key: escapeString(header.key),
    value: escapeString(header.value),
  }));
  const preparedBody = prepareBodyForLanguage(substitutedBody, language);

  const template = codeTemplates[language as keyof typeof codeTemplates];
  if (!template) {
    throw new Error(`Unsupported language: ${language}`);
  }

  return template({
    method,
    url: escapedUrl,
    headers: escapedHeaders,
    body: preparedBody,
  });
};
