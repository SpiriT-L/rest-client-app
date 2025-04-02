import { JSX } from 'react';
import './globals.scss';

export const metadata = {
  title: 'Rest Client App',
  description: 'A modern REST client built with Next.js and TypeScript',
  keywords: ['Next.js', 'TypeScript', 'REST Client', 'React'],
  authors: [{ name: 'Your Name' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="en">
      <body>
        <header>
          <h1>Rest Client App</h1>
        </header>
        <main>{children}</main>
        <footer>
          <div>Footer</div>
        </footer>
      </body>
    </html>
  );
}
