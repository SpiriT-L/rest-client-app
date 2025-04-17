'use client';

import styles from './Header.module.scss';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { Navigation } from '@/components/Navigation/Navigation';
import { Link } from '@/i18n/navigation';
import LanguageSwitcher from '../LanguageSwitcher/LanguageSwitcher';

const Header: React.FC = () => {
  const [isShrunk, setIsShrunk] = useState(false);

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
          <div className={styles.menu}>
            <Navigation />
            <LanguageSwitcher />
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
