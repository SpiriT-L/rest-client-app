'use client';

import styles from './Variables.module.scss';
import React from 'react';
import { VariableItem } from '@/components/VariableItem/VariableItem';
import { useVariables } from '@/components/Variables/useVariables';

export const Variables: React.FC = () => {
  const [variables, addVariable, removeVariable, addEmptyVariableItem] =
    useVariables();

  return (
    <div className={styles.variables}>
      <h1>Variables</h1>
      {!variables && <p>No variables added yet</p>}
      <button onClick={addEmptyVariableItem}>Add new variable</button>
      {variables &&
        variables.map((item, index) => (
          <VariableItem
            key={`${index}-${item.key}`}
            value={item.value}
            name={item.key}
            addItemAction={addVariable}
            removeItemAction={removeVariable}
          />
        ))}
    </div>
  );
};
