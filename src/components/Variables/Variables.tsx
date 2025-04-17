'use client';

import styles from './Variables.module.scss';
import React from 'react';
import { VariableItem } from '@/components/VariableItem/VariableItem';
import { useVariables } from '@/components/Variables/useVariables';
import { useTranslations } from 'next-intl';

const Variables: React.FC = () => {
  const t = useTranslations('Variables');
  const [variables, addVariable, removeVariable, addEmptyVariableItem] =
    useVariables();
  return (
    <div className={styles.variables}>
      <h1>{t('variables')}</h1>
      {!variables && <p>{t('no_variables')}</p>}
      <button onClick={addEmptyVariableItem}>{t('button_title')}</button>
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

export default Variables;
