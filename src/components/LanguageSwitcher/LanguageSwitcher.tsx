'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { JSX } from 'react';

const LanguageSwitcher = (): JSX.Element => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const newLocale = locale === 'en' ? 'ru' : 'en';

  const switchLocale = (): void => {
    const newPathname = pathname.replace(`/${locale}/`, `/${newLocale}/`);
    router.push(newPathname);
  };

  return (
    <button onClick={switchLocale}>{locale === 'en' ? 'Ru' : 'En'}</button>
  );
};

export default LanguageSwitcher;
