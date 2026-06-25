import type { Metadata } from 'next';
import '@livekit/components-styles';
import './globals.css';
import Providers from '@/components/providers';

export const metadata: Metadata = {
  title: 'Meet',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
