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
          <div className={styles.buttonBlock}>
            <Link href="/login" className={styles.button}>
              🚀 {t('button_title')}
            </Link>
          </div>
          <p style={{ marginTop: '20px' }}>
            📖 <Link href="/docs">{t('docs')}</Link> | 🔗{' '}
            <a
              href="https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md"
              target="_blank"
            >
              {t('technical_task')}
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
