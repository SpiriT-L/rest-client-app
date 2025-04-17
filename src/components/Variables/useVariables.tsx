import { useEffect, useState } from 'react';

type Variable = { key: string; value: string };

export const useVariables = (): [
  Variable[] | null,
  (key: string, value: string) => void,
  (key: string) => void,
  () => void,
] => {
  const [emptyVariableKey, setEmptyVariableKey] = useState(0);
  const [variables, setVariables] = useState<Variable[] | null>(null);

  const addVariable = (key: string, value: string): void => {
    const newVariable = { key, value };
    const updatedVariables = variables
      ? [newVariable, ...variables.filter(v => v.key !== key)]
      : [newVariable];
    const filteredVariables = updatedVariables.filter(v => v.value !== '');
    setVariables(filteredVariables);
    localStorage.setItem('rss-variables', JSON.stringify(filteredVariables));
  };

  const removeVariable = (key: string): void => {
    if (!variables) return;
    const newVariables = variables.filter(v => v.key !== key);
    setVariables(newVariables);
    localStorage.setItem('rss-variables', JSON.stringify(newVariables));
  };

  const addEmptyVariableItem = (): void => {
    const newKey = `empty-${emptyVariableKey}`;
    const newVariable = { key: newKey, value: '' };
    setVariables(prev => [newVariable, ...(prev || [])]);
    setEmptyVariableKey(prev => prev + 1);
    localStorage.setItem(
      'rss-variables',
      JSON.stringify([newVariable, ...(variables || [])])
    );
  };

  useEffect(() => {
    const storedVariables = localStorage.getItem('rss-variables');
    if (storedVariables) {
      setVariables(JSON.parse(storedVariables));
    }
  }, []);

  return [variables, addVariable, removeVariable, addEmptyVariableItem];
};
