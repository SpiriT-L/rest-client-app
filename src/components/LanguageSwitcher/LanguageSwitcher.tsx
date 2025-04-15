'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { JSX } from 'react';

const LanguageSwitcher = (): JSX.Element => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const newLocale = locale === 'en' ? 'ru' : 'en';

  const switchLocale = (): void => {
    const segments = pathname.split('/').filter(Boolean);

    if (segments[0] === locale) {
      segments[0] = newLocale;
    } else {
      segments.unshift(newLocale);
    }

    const newPath = `/${segments.join('/')}`;
    router.push(newPath);
  };

  return (
    <button onClick={switchLocale}>{locale === 'en' ? 'Ru' : 'En'}</button>
  );
};

export default LanguageSwitcher;
