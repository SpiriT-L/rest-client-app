import { useEffect, useState } from 'react';
import { Variable } from '@/models/variable';

export const useVariables = (): [
  Variable[],
  (key: string, value: string) => void,
  (key: string) => void,
  () => void,
] => {
  const [emptyVariableKey, setEmptyVariableKey] = useState(0);
  const [variables, setVariables] = useState<Variable[]>([]);

  const addVariable = (key: string, value: string): void => {
    const newVariable = { key, value };
    const updatedVariables = [
      newVariable,
      ...variables.filter(v => v.key !== key),
    ];
    const filteredVariables = updatedVariables.filter(v => v.value !== '');
    setVariables(filteredVariables);
    localStorage.setItem('rss-variables', JSON.stringify(filteredVariables));
  };

  const removeVariable = (key: string): void => {
    const newVariables = variables.filter(v => v.key !== key);
    setVariables(newVariables);
    localStorage.setItem('rss-variables', JSON.stringify(newVariables));
  };

  const addEmptyVariableItem = (): void => {
    const newKey = `empty-${emptyVariableKey}`;
    const newVariable = { key: newKey, value: '' };
    const newVariables = [newVariable, ...variables];
    setVariables(newVariables);
    setEmptyVariableKey(prev => prev + 1);
    localStorage.setItem('rss-variables', JSON.stringify(newVariables));
  };

  useEffect(() => {
    const storedVariables = localStorage.getItem('rss-variables');
    if (storedVariables) {
      try {
        const parsedVariables = JSON.parse(storedVariables);
        setVariables(parsedVariables);
      } catch (error) {
        alert(`Error parsing stored variables: ${error}`);
        setVariables([]);
      }
    }
  }, []);

  return [variables, addVariable, removeVariable, addEmptyVariableItem];
};
