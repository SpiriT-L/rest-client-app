import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'REST Client',
  description: 'A simple REST client application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return <>{children}</>;
}
