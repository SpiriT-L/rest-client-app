'use client';

import styles from './Navigation.module.scss';
import Link from 'next/link';
import React from 'react';
import { usePathname } from 'next/navigation';

export const Navigation: React.FC = () => {
  const path = usePathname();
  const isActive = (href: string): boolean => href === path;
  return (
    <nav className={styles.navigation}>
      <Link
        className={isActive('/rest-client') ? 'active' : ''}
        href={'rest-client'}
      >
        Rest-client
      </Link>
      <Link className={isActive('/history') ? 'active' : ''} href={'history'}>
        History
      </Link>
      <Link
        className={isActive('/variables') ? 'active' : ''}
        href={'variables'}
      >
        Variables
      </Link>
    </nav>
  );
};
