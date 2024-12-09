import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getRecentContent } from '@/lib/content'
import { getHeaderConfig } from '@/lib/headerConfig'
import { getAkiradocsConfig } from '@/lib/getAkiradocsConfig'
import { Locale } from '@/types/AkiraConfigType'

type Props = {
  params: Promise<{
    locale: string;
    type: string;
  }>;
}

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const akiraconfig = await getAkiradocsConfig();
  const locales = akiraconfig.localization.locales.map((locale: Locale) => locale.code); 
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
  const akiraconfig = await getAkiradocsConfig();
  return {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} - ${headerConfig.title}`,
    description: `Browse our latest ${type}`,
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${type}`,
      languages: Object.fromEntries(
        akiraconfig.localization.locales.map((locale: Locale) => [
          locale.code,
          `${process.env.NEXT_PUBLIC_SITE_URL}/${locale.code}/${type}`
        ])
      )
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
