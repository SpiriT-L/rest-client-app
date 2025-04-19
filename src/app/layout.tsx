import type { Metadata } from 'next';
import { JSX } from 'react';


export const metadata: Metadata = {
  title: 'REST Client',
  description: 'A simple REST client application',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}): Promise<JSX.Element> {
  const { locale } = await params;
  return (
    <html lang={locale}>
      <body>{children}</body>
    </html>
  );
}
