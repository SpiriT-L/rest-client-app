import styles from './NotSignedIn.module.scss';
import React from 'react';
import { useTranslations } from 'next-intl';

export const NotSignedIn: React.FC = () => {
  const t = useTranslations('NotSignedIn');
  return (
    <div className={styles.notSignedIn}>
      <p>{t('not_signed_in')}</p>
      <p>{t('come_back')}</p>
    </div>
  );
};
