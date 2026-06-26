import type { Metadata, Viewport } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import '@livekit/components-styles';
import './globals.css';
import Providers from '@/components/providers';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const BG = '#0c0f0d';

export const metadata: Metadata = {
  title: 'meet.srinath — self-hosted',
  description: 'Self-hosted video meetings on LiveKit.',
};

// no flash: browser chrome + first paint match the theme before any CSS loads
export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: BG,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrains.variable}`}
      style={{ colorScheme: 'dark', backgroundColor: BG }}
      suppressHydrationWarning
    >
      <body
        className="bg-bg font-sans text-ink antialiased"
        style={{ backgroundColor: BG }}
        suppressHydrationWarning
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
