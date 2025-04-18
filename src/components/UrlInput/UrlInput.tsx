'use client';

import { useTranslations } from 'next-intl';
import styles from './UrlInput.module.scss';

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
}

export default function UrlInput({ value, onChange }: UrlInputProps) {
  const t = useTranslations('UrlInput');
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={t('placeholder')}
      className={styles.input}
    />
  );
}
