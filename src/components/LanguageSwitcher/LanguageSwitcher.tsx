'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { JSX } from 'react';

const LanguageSwitcher = (): JSX.Element => {
  const locale = useLocale();
  const router = useRouter();
  const newLocale = locale === 'en' ? 'ru' : 'en';

  const switchLocale = (): void => {
    router.push(`/${newLocale}`);
  };

  return (
    <button onClick={switchLocale}>{locale === 'en' ? 'Ru' : 'En'}</button>
  );
};

export default LanguageSwitcher;
