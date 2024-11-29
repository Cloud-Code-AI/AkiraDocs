'use client'

import React from 'react'
import { redirect } from 'next/navigation'
import { getAllPosts, getRecentContent } from '@/lib/content'
import { NotFound } from '@/components/layout/NotFound'
import { SEO } from '@/components/layout/SEO'
import { getHeaderConfig } from '@/lib/headerConfig'
import { Header } from '@/components/layout/Header'
import { getFooterConfig } from '@/lib/footerConfig'
import { Footer } from '@/components/layout/Footer'
import { ArticleCard } from '@/components/layout/ArticleCard'
import { Post } from '@/types/Block'

export const runtime = 'edge'

export default function Page({ params }: { params: Promise<{ locale: string, type: string }> }) {
  const resolvedParams = React.use(params)
  const locale = resolvedParams.locale || ''
  const type = resolvedParams.type || ''
  const headerConfig = getHeaderConfig();
  const footerConfig = getFooterConfig();
  
  if (type === 'articles') {
    const articles = getAllPosts(locale, 'articles')
    return (
      <div className="flex flex-col min-h-screen">
        <SEO
          title={`Articles - ${headerConfig.title}`}
          description="Browse our latest articles"
          canonical={`${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/articles`}
        />
        <Header {...headerConfig} currentLocale={locale} />
        <div className="flex flex-grow">
          <div className="flex-1 p-6 w-full">
            <h1 className="text-3xl font-bold mb-6">Articles</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles?.map((article: Post) => (
                <ArticleCard
                  key={article.slug}
                  title={article.title}
                  description={article.description}
                  author={article.author}
                  publishDate={article.publishDate}
                  slug={article.slug || ''}
                  locale={locale}
                  type={type}
                />
              ))}
            </div>
          </div>
        </div>
        <Footer {...footerConfig} />
      </div>
    )
  }

  const recentContent = getRecentContent(`${locale}/${type}`)
  if (recentContent) {
    const redirectUrl = `/${locale}/${type}/${recentContent.slug.replace(`${type}/`, '')}`
    redirect(redirectUrl)
  }

  return <NotFound redirectUrl={`/`} />
}
