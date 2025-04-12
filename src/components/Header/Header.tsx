'use client';

import styles from './Header.module.scss';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useIsSignedIn } from '@/hooks/useIsSignedIn';
import { Navigation } from '@/components/Navigation/Navigation';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const Header: React.FC = () => {
  const t = useTranslations('Header');
  const [isShrunk, setIsShrunk] = useState(false);
  const isSignedIn = useIsSignedIn();

  useEffect(() => {
    const handleScroll = (): void => {
      if (window.scrollY > 50) {
        setIsShrunk(true);
      } else {
        setIsShrunk(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return (): void => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <header className={`${styles.header} ${isShrunk ? styles.shrink : ''}`}>
        <div className={styles.headerContainer}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink}>
              <Image src="/logo.svg" alt="Logo" width={100} height={50} />
            </Link>
          </div>

          {isSignedIn && <Navigation />}
          <nav className={styles.nav}>
            <ul className={styles.navItems}>
              <li>
                <Link href="/" className={styles.navItem}>
                  {t('sign_in')}
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.navItem}>
                  {t('sing_up')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <LanguageSwitcher />
      </header>
    </>
  );
};

export default Header;
