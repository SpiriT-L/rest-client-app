'use client';

import styles from './Navigation.module.scss';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export const Navigation: React.FC = () => {
  const t = useTranslations('Navigation');
  const path = usePathname();
  const isActive = (href: string): boolean => href === path;
  return (
    <nav className={styles.navigation}>
      <Link
        className={isActive('/rest-client') ? 'active' : ''}
        href={'rest-client'}
      >
        {t('rest_client')}
      </Link>
      <Link className={isActive('/history') ? 'active' : ''} href={'history'}>
        {t('history')}
      </Link>
      <Link
        className={isActive('/variables') ? 'active' : ''}
        href={'variables'}
      >
        {t('variables')}
      </Link>
    </nav>
  );
};
