import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getAllPosts, getRecentContent } from '@/lib/content'
import { getHeaderConfig } from '@/lib/headerConfig'

type Props = {
  params: Promise<{
    locale: string;
    type: string;
  }>;
}

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const locales = ['en', 'es', 'fr']; 
  const types = ['docs', 'api', 'articles'];
  const params: { locale: string, type: string }[] = [];

  locales.forEach(locale => {
    types.forEach(type => {
      params.push({ locale, type });
    });
  });

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const { locale, type } = resolvedParams;
  const headerConfig = getHeaderConfig();

  return {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${headerConfig.title}`,
    description: `Browse our latest ${type}`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${type}`,
      languages: {
        'en': `${process.env.NEXT_PUBLIC_SITE_URL}/en/${type}`,
        'es': `${process.env.NEXT_PUBLIC_SITE_URL}/es/${type}`,
        'fr': `${process.env.NEXT_PUBLIC_SITE_URL}/fr/${type}`,
      }
    }
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const { locale, type } = resolvedParams;
  
  // Get the first/default content for this type
  const recentContent = getRecentContent(`${locale}/${type}`);
  
  if (recentContent) {
    const redirectUrl = `/${locale}/${type}/${recentContent.slug.replace(`${type}/`, '')}`;
    redirect(redirectUrl);
  }

  // Fallback redirect if no content found
  redirect(`/${locale}`);
}
