'use client';

import styles from './Navigation.module.scss';
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/firebase/config';

export const Navigation: React.FC = () => {
  const t = useTranslations('Navigation');
  const path = usePathname();
  const router = useRouter();
  const isActive = (href: string): boolean => path.includes(href);
  const [user] = useAuthState(auth);
  const handleSignOut: () => Promise<void> = async () => {
    await auth.signOut();
    router.push('/');
  };

  return (
    <nav className={styles.navigation}>
      {user ? (
        <>
          <Link
            className={`${styles.navItem} ${isActive('/rest-client') ? 'active' : ''}`}
            href={'rest-client'}
          >
            {t('rest_client')}
          </Link>
          <Link
            className={`${styles.navItem} ${isActive('/history') ? 'active' : ''}`}
            href={'history'}
          >
            {t('history')}
          </Link>
          <Link
            className={`${styles.navItem} ${isActive('/variables') ? 'active' : ''}`}
            href={'variables'}
          >
            {t('variables')}
          </Link>
          <span>{user.email}</span>
          <button onClick={handleSignOut}>{t('sign_out')}</button>
        </>
      ) : (
        <>
          {' '}
          <Link
            href="/login"
            className={`${styles.navItem} ${isActive('/login') ? 'active' : ''}`}
          >
            {t('sign_in')}
          </Link>
          <Link
            href="/register"
            className={`${styles.navItem} ${isActive('/register') ? 'active' : ''}`}
          >
            {t('sing_up')}
          </Link>
        </>
      )}
    </nav>
  );
};
