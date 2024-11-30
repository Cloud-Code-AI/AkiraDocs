'use client'

import React from 'react'
import { getContentBySlug, getContentNavigation } from '@/lib/content'
import { BlockRenderer } from '@/lib/renderers/BlockRenderer'
import { Header } from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Navigation from '@/components/layout/Navigation'
import TableOfContents from '@/components/layout/TableOfContents'
import { getHeaderConfig } from '@/lib/headerConfig'
import { getFooterConfig } from '@/lib/footerConfig'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'
import { PageBreadcrumb } from '@/components/layout/Breadcrumb'
import { getNextPrevPages } from '@/lib/navigationUtils'
import { PageNavigation } from '@/components/layout/PageNavigation'
import { MainTitle, SubTitle } from '@/components/blocks/HeadingBlock'
import { SEO } from '@/components/layout/SEO'
import { NotFound } from '@/components/layout/NotFound'
import { TextToSpeech } from '@/components/tts/TextToSpeech'
import { getAkiradocsConfig } from '@/lib/getAkiradocsConfig'

export const runtime = 'edge'

const PostContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="flex-1 min-w-0 px-8 py-6 mx-4 font-sans leading-relaxed relative">
    {children}
  </div>
)

export default function ContentPage({ params }: { params: Promise<{ locale: string, type: string, slug: string[] }> }) {
  const resolvedParams = React.use(params)
  const config = getAkiradocsConfig()
  const locale = resolvedParams.locale
  const type = resolvedParams.type
  const slug = resolvedParams.slug?.length ? resolvedParams.slug.join('/') : ''
  const post = getContentBySlug(locale, type, slug)
  if (!post) {
    return <NotFound redirectUrl={`/${locale}/${type}`} />
  }
  const akiradocsConfig = getAkiradocsConfig()
  const config = getAkiradocsConfig()
  const headerConfig = getHeaderConfig();
  const footerConfig = getFooterConfig();
  const navigationItems = getContentNavigation({}, locale, type)
  const { prev, next } = getNextPrevPages(navigationItems, `/${type}/${slug}`);
  const pageTitle = post.title || 'Documentation'
  const pageDescription = post.description || 'Documentation content'
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/${type}/${slug}`
  const handleEdit = () => {
    const fileSlug = slug !== '' ? slug : post.id || post.filename?.replace('.json', '')
    const filePath = `${locale}/${type}/${fileSlug}.json`
    window.location.href = `/editor/${filePath}`
  }

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
                {process.env.NEXT_PUBLIC_AKIRADOCS_EDIT_MODE === 'true' && (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                )}
                {akiradocsConfig.features.textToSpeech && (
                  <TextToSpeech blocks={post.blocks} />
                )}
              </div>
              <MainTitle>{post.title}</MainTitle>
              <SubTitle>{post.description}</SubTitle>
              {post.blocks.map((block) => (
                block.content !== post.title && (
                  <BlockRenderer key={block.id} block={block} />
                )
              ))}
              <PageNavigation prev={prev} next={next} locale={locale}  />
            </div>
          </PostContainer>
          <TableOfContents publishDate={post.publishDate} modifiedDate={post.modifiedDate} author={post.author} />
        </div>
      </div>
      <Footer {...footerConfig} />
    </div>
  )
}