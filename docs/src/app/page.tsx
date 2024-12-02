import { getRecentContent } from '@/lib/content'
import { redirect } from 'next/navigation'
import { getAkiradocsConfig } from '@/lib/getAkiradocsConfig'

export const dynamic = 'force-static'

export async function generateMetadata() {
  const config = getAkiradocsConfig()
  
  return {
    title: config.site.title,
    description: config.site.description,
    alternates: {
      canonical: process.env.NEXT_PUBLIC_SITE_URL,
    }
  }
}

export default async function DocPage() {
  const config = getAkiradocsConfig()
  const defaultLocale = config.localization.defaultLocale
  const recentContent = getRecentContent(`${defaultLocale}/docs`)

  if (recentContent) {
    const redirectUrl = `/${defaultLocale}/docs/${recentContent.slug.replace('docs/', '')}`
    redirect(redirectUrl)
  }

  // Fallback redirect if no content found
  redirect(`/${defaultLocale}/docs`)
}