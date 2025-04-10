import { JSX } from 'react';
import './globals.scss';
import Header from '@/components/Header/Header';

export const metadata = {
  title: 'Rest Client App',
  description: 'A modern REST client built with Next.js and TypeScript',
  keywords: ['Next.js', 'TypeScript', 'REST Client', 'React'],
  authors: [{ name: 'RSS-React-team' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <footer>
          <div>Footer</div>
        </footer>
      </body>
    </html>
  );
}
