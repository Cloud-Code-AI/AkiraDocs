'use client'

import React from 'react'
import { getArticleBySlug } from '@/lib/articles'
import { BlockRenderer } from '@/components/content/renderers/BlockRenderer'
import { Header } from '@/components/content/layout/Header'
import Footer from '@/components/content/layout/Footer'
import Navigation from '@/components/content/layout/Navigation'
import TableOfContents from '@/components/content/layout/TableOfContents'
import { getArticlesNavigation } from '@/lib/getNavigation'
import { getHeaderConfig } from '@/lib/headerConfig'
import { getFooterConfig } from '@/lib/footerConfig'
import { Button } from '@/components/ui/button'
import { Edit2 } from 'lucide-react'

const PostContainer = ({ children }: { children: React.ReactNode }) => (
  <div className="max-w-4xl mx-auto px-6 font-sans leading-relaxed relative">
    {children}
  </div>
)

export default function ArticlesPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = React.use(params)
  const slug = resolvedParams.slug?.length ? resolvedParams.slug.join('/') : ''
  const post = getArticleBySlug(slug)
  const headerConfig = getHeaderConfig();
  const footerConfig = getFooterConfig();
  const navigationItems = getArticlesNavigation({})
  console.log('Dev mode:', process.env.NEXT_PUBLIC_AKIRADOCS_EDIT_MODE) // Debug log

  const handleEdit = () => {
    const articleSlug = slug !== '' ? slug : post.id
    const filePath = `articles/${articleSlug}.json`
    window.location.href = `/editor?file=${encodeURIComponent(filePath)}`
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header {...headerConfig} />
      <div className="flex flex-grow">
        <Navigation items={navigationItems} />
        <div className="flex-1 flex py-4">
          <PostContainer>
            {process.env.NEXT_PUBLIC_AKIRADOCS_EDIT_MODE === 'true' && (

              <Button
                onClick={handleEdit}
                variant="outline"
                size="sm"
                className="absolute top-0 right-6 flex items-center gap-2 text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </Button>
            )}

            {post.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </PostContainer>
          <TableOfContents />
        </div>
      </div>
      <Footer {...footerConfig} />
    </div>
  )
}