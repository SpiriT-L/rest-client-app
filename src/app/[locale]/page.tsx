import { useTranslations } from 'next-intl';
import { JSX } from 'react';

export default function HomePage(): JSX.Element {
  const t = useTranslations('HomePage');
  return (
    <div>
      <h1>{t('title')}</h1>
    </div>
  );
}
