import styles from './Footer.module.scss';
import Image from 'next/image';
import React from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const Footer: React.FC = () => {
  const t = useTranslations('Footer');
  return (
    <footer className={styles.footer}>
      <div className={styles.links}>
        <Link
          className={styles.link}
          target="_blank"
          href="https://github.com/nastyavolkm"
        >
          <Image width={24} height={24} alt="github" src="/github.svg" />
          {t('nastya')}
        </Link>
        <Link
          className={styles.link}
          target="_blank"
          href="https://github.com/SpiriT-L"
        >
          <Image width={24} height={24} alt="github" src="/github.svg" />
          {t('leonid')}
        </Link>
        <Link
          className={styles.link}
          target="_blank"
          href="https://github.com/zm1try"
        >
          <Image width={24} height={24} alt="github" src="/github.svg" />
          {t('dima')}
        </Link>
      </div>
      <p>2025</p>
      <Link
        className={styles.link}
        target="_blank"
        href="https://rs.school/courses/reactjs"
      >
        <Image width={24} height={24} alt="rs" src="/rss-logo.svg" />
      </Link>
    </footer>
  );
};

export default Footer;
