import React from 'react'
import { getContentBySlug, getContentNavigation } from '@/lib/content'
import { BlockRenderer } from '@/lib/renderers/BlockRenderer'
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Navigation from '@/components/layout/Navigation'
import TableOfContents from '@/components/layout/TableOfContents'
import { getHeaderConfig } from '@/lib/headerConfig'
import { getFooterConfig } from '@/lib/footerConfig'
import { PageBreadcrumb } from '@/components/layout/Breadcrumb'
import { getNextPrevPages } from '@/lib/navigationUtils'
import { PageNavigation } from '@/components/layout/PageNavigation'
import { MainTitle, SubTitle } from '@/components/blocks/HeadingBlock'
import { SEO } from '@/components/layout/SEO'
import { NotFound } from '@/components/layout/NotFound'
// import { TextToSpeech } from '@/components/tts/TextToSpeech'
import { getAkiradocsConfig } from "@/lib/getAkiradocsConfig";
import { getTranslation } from '@/lib/staticTranslation';
import { ClientSideControls } from '@/components/layout/ClientSideControl';
import { Metadata } from 'next'

// export const runtime = 'edge'
export const dynamic = 'force-static';

const PostContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 min-w-0 px-8 py-6 mx-4 font-sans leading-relaxed relative">
    {children}
  </div>
)

type Props = {
  params: Promise<{
    locale: string;
    type: string;
    slug: string[];
  }>;
}

export async function generateStaticParams() {
  const locales = ['en', 'es', 'fr']; 
  const types = ['docs', 'api', 'articles'];
  const allSlugs: { locale: string, type: string, slug: string[] }[] = [];

  locales.forEach(locale => {
    types.forEach(type => {
      const navigationItems = getContentNavigation({}, locale, type);
      if (Array.isArray(navigationItems)) {
        navigationItems.forEach(item => {
          if (item.slug) {
            allSlugs.push({ locale, type, slug: item.slug.split('/') });
          }
        });
      }
    });
  });

  return allSlugs;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await Promise.resolve(params);
  const { locale, type, slug: slugArray } = resolvedParams;
  
  const slug = slugArray.length ? slugArray.join('/') : '';
  const post = getContentBySlug(locale, type, slug);
  const t = getTranslation(locale as 'en' | 'es' | 'fr');
  const akiradocsConfig = getAkiradocsConfig();

  return {
    title: t(post?.title) || 'Documentation',
    description: t(post?.description) || 'Documentation content',
    alternates: {
      canonical: `${akiradocsConfig.site.url}/${locale}/${type}/${slug}`,
      languages: {
        'en': `${akiradocsConfig.site.url}/en/${type}/${slug}`,
        'es': `${akiradocsConfig.site.url}/es/${type}/${slug}`,
        'fr': `${akiradocsConfig.site.url}/fr/${type}/${slug}`,
      }
    },
    openGraph: {
      title: t(post?.title) || 'Documentation',
      description: t(post?.description) || 'Documentation content',
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${type}/${slug}`,
      siteName: 'Your Site Name',
      locale: locale,
      type: 'article',
    }
  }
}

export default async function ContentPage({ params }: Props) {
  const resolvedParams = await Promise.resolve(params);
  const { locale, type, slug: slugArray } = resolvedParams;
  const t = getTranslation(locale as 'en' | 'es' | 'de');
  
  const slug = slugArray.length ? slugArray.join('/') : '';
  const post = getContentBySlug(locale, type, slug);

  if (!post) {
    return <NotFound redirectUrl={`/${locale}/${type}`} />;
  }

  const akiradocsConfig = getAkiradocsConfig();
  const headerConfig = getHeaderConfig();
  const footerConfig = getFooterConfig();
  const navigationItems = getContentNavigation({}, locale, type);
  const { prev, next } = getNextPrevPages(navigationItems, `/${type}/${slug}`);
  const pageTitle = t(post.title) || t('common.documentation');
  const pageDescription = t(post.description) || t('common.documentationContent');
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${type}/${slug}`;

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title={pageTitle}
        description={pageDescription}
        canonical={canonicalUrl}
      />
      <Header {...headerConfig} currentLocale={locale} />
      <div className="flex flex-grow">
        <Navigation key={type} locale={locale} items={navigationItems} />
        <div className="flex-1 flex py-4 w-full">
          <PostContainer>
            <div className="relative">
              <PageBreadcrumb type={type} slug={slug} locale={locale} />
              <div className="absolute top-0 right-0 flex gap-2">
                <ClientSideControls 
                  editMode={process.env.NEXT_PUBLIC_AKIRADOCS_EDIT_MODE === 'true'}
                  textToSpeech={akiradocsConfig.features.textToSpeech}
                  locale={locale}
                  type={type}
                  slug={slug}
                  blocks={post.blocks}
                />
              </div>
              <MainTitle>{t(post.title)}</MainTitle>
              <SubTitle>{t(post.description)}</SubTitle>
              {post.blocks.map((block) => (
                block.content !== post.title && (
                  <BlockRenderer 
                    key={block.id} 
                    block={{
                      ...block,
                      content: block.content
                    }} 
                  />
                )
              ))}
              <PageNavigation prev={prev} next={next} locale={locale} />
            </div>
          </PostContainer>
          <TableOfContents 
            publishDate={post.publishDate} 
            modifiedDate={post.modifiedDate} 
            author={post.author} 
            locale={locale}
          />
        </div>
      </div>
      <Footer {...footerConfig} />
    </div>
  );
}