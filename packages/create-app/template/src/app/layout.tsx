import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Toaster } from 'sonner';
import { getMetadata } from '@/lib/getMetadata';
import { ThemeProvider } from '@/components/ui/theme-provider';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

const metadataValues = getMetadata();

export const metadata: Metadata = {
  title: {
    template: '%s | ' + (metadataValues.title ?? 'Site Title'),
    default: metadataValues.title ?? 'Site Title',
  },
  description: metadataValues.description ?? 'Site description',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: metadataValues.title,
    images: [
      {
        url: '/akiradocs_logo.svg',
        width: 1200,
        height: 630,
        alt: metadataValues.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: metadataValues.title,
    description: metadataValues.description,
    images: ['/akiradocs_logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
