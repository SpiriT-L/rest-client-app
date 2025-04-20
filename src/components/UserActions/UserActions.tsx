'use client';

import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import styles from './UserActions.module.scss';
import { auth } from '@/firebase/config';
import { JSX } from 'react';
import { useTranslations } from 'next-intl';

export default function UserActions(): JSX.Element {
  const [user] = useAuthState(auth);
  const t = useTranslations('UserActions');

  return (
    <>
      {user ? (
        <>
          <Link href="/login" className={styles.button}>
            🚀 {t('button_rest-client')}
          </Link>
        </>
      ) : (
        <>
          <Link href="/login" className={styles.button}>
            {t('button_sign_in')}
          </Link>
          <Link href="/register" className={styles.button}>
            {t('button_sign_up')}
          </Link>
        </>
      )}
    </>
  );
}
