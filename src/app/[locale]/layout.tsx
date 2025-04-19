import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import './styles.css';
import { JSX } from 'react';
import Footer from '@/components/Footer/Footer';
import ErrorBoundary from '@/components/ErrorBoundary/ErrorBoundary';
import { Header } from '@/components/Header/Header';

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
    <NextIntlClientProvider locale={locale} messages={messages.default}>
      <ErrorBoundary>
        <Header />
        <main>{children}</main>
        <Footer />
      </ErrorBoundary>
    </NextIntlClientProvider>
  );
}
