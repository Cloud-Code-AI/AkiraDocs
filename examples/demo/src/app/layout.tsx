import type { Metadata } from "next";
import localFont from "next/font/local";
import "../styles/globals.css";
import { Toaster } from "sonner"
import { getMetadata } from "@/lib/getMetadata";
import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { type ThemeProviderProps } from "next-themes/dist/types"
import { TranslationProvider } from '@/contexts/TranslationContext';
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

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

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
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <GoogleAnalytics />
          <TranslationProvider>
            {children}
          </TranslationProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
