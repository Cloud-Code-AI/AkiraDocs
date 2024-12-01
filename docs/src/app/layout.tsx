import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import { getMetadata } from "@/lib/getMetadata";
import * as React from "react"
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics'

const geistSans = localFont({
  src: "../styles/fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../styles/fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const metadataValues = getMetadata()

export const metadata: Metadata = {
  title: {
    template: '%s | ' + (metadataValues.title ?? 'Site Title'),
    default: metadataValues.title ?? 'Site Title',
  },
  icons: {
    icon: '/akira_favicon.png',
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

// Mark ThemeProvider as a Client Component
const ThemeProvider = React.lazy(() => import('@/components/providers/ThemeProvider'));
const ToasterProvider = React.lazy(() => import('@/components/providers/ToasterProvider'));

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <React.Suspense fallback={null}>
          <ThemeProvider>
            <GoogleAnalytics />
            {children}
            <ToasterProvider />
          </ThemeProvider>
        </React.Suspense>
      </body>
    </html>
  );
}
