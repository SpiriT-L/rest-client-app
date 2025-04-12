'use client';

import styles from './Header.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useIsSignedIn } from '@/hooks/useIsSignedIn';
import { Navigation } from '@/components/Navigation/Navigation';

const Header: React.FC = () => {
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
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/about" className={styles.navItem}>
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;
