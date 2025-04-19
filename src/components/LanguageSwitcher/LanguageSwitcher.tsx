'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { JSX } from 'react';

const LanguageSwitcher = (): JSX.Element => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const newLocale = locale === 'en' ? 'ru' : 'en';

  const switchLocale = (): void => {
    const queryString = searchParams.toString();
    const query = queryString ? `?${queryString}` : '';

    if (pathname === `/${locale}` || pathname === `/${locale}/`) {
      router.push(`/${newLocale}${query}`);
      return;
    }

    const newPathname = pathname.replace(`/${locale}/`, `/${newLocale}/`);
    router.push(`${newPathname}${query}`);
  };

  return (
    <button onClick={switchLocale}>{locale === 'en' ? 'Ru' : 'En'}</button>
  );
};

export default LanguageSwitcher;
