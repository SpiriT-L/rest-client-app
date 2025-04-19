import { useTranslations } from 'next-intl';
import { JSX } from 'react';
import Link from 'next/link';
import styles from './page.module.scss';
import Button from '@/components/Button/Button';

export default function HomePage(): JSX.Element {
  const t = useTranslations('HomePage');
  return (
    <>
      <div className={styles.container}>
        <div>
          <h1 className={styles.title}>🚀 {t('title')}</h1>
          <p className={styles.description}>{t('description')}</p>
          <h2 className={styles.subTitle}>🔹 {t('subTitle')}</h2>
          <ul className={styles.items}>
            <li>✅ {t('support_methods')}</li>
            <li>✅ {t('customizing')}</li>
            <li>✅ {t('history')}</li>
            <li>✅ {t('language')}</li>
          </ul>
          <h2 className={styles.subTitle}>🔹 {t('subTitle_2')}</h2>
          <p className={styles.context}>{t('context')}</p>
          <h2 className={styles.subTitle}>🔹 {t('subTitle_3')}</h2>
          <Link href="/login">
            <button>🚀 Попробовать REST Client</button>
          </Link>
          <p style={{ marginTop: '20px' }}>
            📖 <Link href="/docs">Документация</Link> | 🔗{' '}
            <a
              href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md"
              target="_blank"
            >
              Техническое задание
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
