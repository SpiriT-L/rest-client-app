import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Header from '@/components/Header/Header';
import '@/styles/globals.scss';
import { JSX } from 'react';

export const metadata = {
  title: 'Rest Client App',
  description: 'A modern REST client built with Next.js and TypeScript',
  keywords: ['Next.js', 'TypeScript', 'REST Client', 'React'],
  authors: [{ name: 'RSS-React-team' }],
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await import(`../../../messages/${locale}.json`);

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider locale={locale} messages={messages.default}>
          <Header />
          <main>{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
