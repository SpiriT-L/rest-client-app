import { useState } from 'react';
import styles from '@/components/VariableItem/VariableItem.module.scss';

export const useVariableItem = (
  name: string,
  value: string,
  addItemAction: (key: string, value: string) => void
): [
  string,
  string,
  boolean,
  (type: 'value' | 'key', newValue: string) => void,
  () => void,
  () => string,
] => {
  const [isEditing, setIsEditing] = useState(!(name && value));
  const [key, setKey] = useState(name);
  const [newValue, setNewValue] = useState(value);
  const saveVariable = (): void => {
    setIsEditing(false);
    addItemAction(key, newValue);
  };

  const getApplyActionStyles = (): string => {
    if (!isEditing || (key && newValue && name && value)) {
      return styles.invisible;
    }

    if (key && newValue) {
      return styles.action;
    }

    return styles.disabled;
  };

  const setNewValues = (type: 'value' | 'key', newValue: string): void => {
    setIsEditing(true);
    if (type === 'value') {
      setNewValue(newValue);
    } else {
      setKey(newValue);
    }
  };

  return [
    newValue,
    key,
    isEditing,
    setNewValues,
    saveVariable,
    getApplyActionStyles,
  ];
};
