import { RestClientState } from '@/models/rest-client';
import { Variable } from '@/models/variable';
import { codeTemplates } from './codeTemplates';
import { substituteVariables } from './variableSubstitution';

const escapeString = (str: string): string => {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
};

const formatJson = (json: string): string => {
  try {
    const parsed = JSON.parse(json);
    return JSON.stringify(parsed);
  } catch {
    return json;
  }
};

const validateJson = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
};

const prepareBodyForLanguage = (body: string, language: string): string => {
  if (!body) return '';

  const formattedBody = formatJson(body);

  // For curl, we want the raw JSON without escaping quotes
  if (language === 'curl') {
    return formattedBody;
  }

  // For other languages, we want the raw JSON as well
  return formattedBody;
};

export const generateCode = (
  state: RestClientState,
  variables: Variable[],
  language: string
): string => {
  const { method, url, headers, body } = state;

  // Substitute variables
  const substitutedUrl = substituteVariables(url, variables);
  const substitutedHeaders = headers.map(header => ({
    ...header,
    value: substituteVariables(header.value, variables),
  }));
  const substitutedBody = body ? substituteVariables(body, variables) : '';

  // Validate JSON body if present
  if (substitutedBody && !validateJson(substitutedBody)) {
    throw new Error('Invalid JSON in request body');
  }

  // Escape strings
  const escapedUrl = escapeString(substitutedUrl);
  const escapedHeaders = substitutedHeaders.map(header => ({
    key: escapeString(header.key),
    value: escapeString(header.value),
  }));
  const preparedBody = prepareBodyForLanguage(substitutedBody, language);

  // Get template function
  const template = codeTemplates[language as keyof typeof codeTemplates];
  if (!template) {
    throw new Error(`Unsupported language: ${language}`);
  }

  // Generate code
  return template({
    method,
    url: escapedUrl,
    headers: escapedHeaders,
    body: preparedBody,
  });
};
