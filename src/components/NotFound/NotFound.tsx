import { useTranslations } from 'next-intl';
import styles from './NotFound.module.scss';
import React from 'react';

export const NotFound: React.FC = () => {
  const t = useTranslations('NotFound');
  return (
    <div className={styles.notFound}>
      <h1>404</h1>
      <h1>{t('not_found')}</h1>
      <p>{t('not_exist')}</p>
    </div>
  );
};
