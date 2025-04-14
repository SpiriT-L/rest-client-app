'use client';
import { useVariableItem } from '@/components/VariableItem/useVariableItem';
import styles from './VariableItem.module.scss';
import React from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

type VariableItemProps = {
  name: string;
  value: string;
  removeItemAction: (key: string) => void;
  addItemAction: (key: string, value: string) => void;
};

export const VariableItem: React.FC<VariableItemProps> = ({
  name,
  value,
  removeItemAction,
  addItemAction,
}: VariableItemProps) => {
  const [
    newValue,
    key,
    isEditing,
    setNewValues,
    saveVariable,
    getApplyActionStyles,
  ] = useVariableItem(name, value, addItemAction);
  const t = useTranslations('Variables');
  return (
    <div className={styles.variable}>
      <div className={styles.content}>
        <input
          onChange={event => setNewValues('key', event.target.value)}
          className={`${styles.input} ${!isEditing ? styles.readonly : ''}`}
          type="text"
          placeholder={isEditing ? t('variable_key') : ''}
          defaultValue={isEditing ? '' : key}
        />
        <input
          onChange={event => setNewValues('value', event.target.value)}
          className={`${styles.input} ${!isEditing ? styles.readonly : ''}`}
          type="text"
          placeholder={isEditing ? t('variable_value') : ''}
          defaultValue={newValue}
        />
      </div>
      <div className={styles.actions}>
        <Image
          onClick={saveVariable}
          className={`${styles.action} ${getApplyActionStyles()}`}
          src="/apply.svg"
          alt="save"
          width={24}
          height={24}
        />
        <Image
          onClick={() => removeItemAction(name)}
          className={styles.action}
          src="/remove.svg"
          alt="remove"
          width={24}
          height={24}
        />
      </div>
    </div>
  );
};
