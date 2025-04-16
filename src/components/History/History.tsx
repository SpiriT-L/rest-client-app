import React from 'react';
import { useTranslations } from 'next-intl';
import styles from './History.module.scss';
import { useHistory } from '@/components/History/useHistory';
import Link from 'next/link';
import { buildRequestRoute } from '@/utils/buildRequestRoute';

const History: React.FC = () => {
  const t = useTranslations('History');
  const { history } = useHistory();

  return (
    <div className={styles.history}>
      <h1>{t('history')}</h1>
      {(!history || history.length < 1) && (
        <div className={styles.empty}>
          <p>{t('no_history')}</p>
          <p>{t('empty')}</p>
          <p>
            {t('options')} <Link href={'/rest-client'}>{t('link')}</Link>
          </p>
        </div>
      )}
      {history && history.length > 0 && (
        <div className={styles.historyList}>
          {' '}
          {history.map((item, index) => (
            <Link
              href={`/rest-client${buildRequestRoute(item)}`}
              key={`${index}-${item.url}`}
              className={styles.historyItem}
            >
              <p>{item.method}</p>
              <p>{item.url}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;
