type Variable = { key: string; value: string };

/**
 * Substitutes variables in a text with their values
 * @param text The text containing variables in format {{variableName}}
 * @param variables Array of variables with their values
 * @returns Text with variables substituted with their values
 */
export const substituteVariables = (
  text: string,
  variables: Variable[]
): string => {
  if (!text || !variables.length) return text;

  return text.replace(/\{\{([^}]+)\}\}/g, (match, variableName) => {
    const variable = variables.find(v => v.key === variableName);
    return variable ? variable.value : match;
  });
};

/**
 * Checks if a text contains any variables
 * @param text The text to check
 * @returns true if text contains variables in format {{variableName}}
 */
export const hasVariables = (text: string): boolean => {
  return /\{\{([^}]+)\}\}/.test(text);
};

/**
 * Extracts variable names from a text
 * @param text The text containing variables
 * @returns Array of variable names found in the text
 */
export const extractVariableNames = (text: string): string[] => {
  const matches = text.match(/\{\{([^}]+)\}\}/g);
  if (!matches) return [];

  return matches.map(match => match.slice(2, -2));
};
