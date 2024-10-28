"use client"
import React from 'react'
import { getDocBySlug } from '@/lib/docs'
import { BlockRenderer } from '@/components/content/renderers/BlockRenderer'
import styled from 'styled-components'
import { Header } from '@/components/content/layout/Header'
import Footer from '@/components/content/layout/Footer'
import Navigation from '@/components/content/layout/Navigation'
import TableOfContents from '@/components/content/layout/TableOfContents'
import { getNavigation, getFooterData } from '@/lib/getNavigation'
import { getHeaderConfig } from '@/lib/headerConfig'
import { getFooterConfig } from '@/lib/footerConfig'

const PostContainer = styled.div`
  max-width: 56rem; // This is equivalent to max-w-4xl
  margin: 0 auto;
  padding: 1rem 1.5rem; // Equivalent to px-4 sm:px-6
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
`

export default function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = React.use(params)
  const slug = resolvedParams.slug?.length ? resolvedParams.slug.join('/') : ''
  const post = getDocBySlug(slug)
  const headerConfig = getHeaderConfig();
  const footerConfig = getFooterConfig();
  const navigationItems = getNavigation({})


  return (
    <div className="flex flex-col h-screen">
      <Header {...headerConfig} />
      <div className="flex flex-grow">
        <Navigation items={navigationItems} />
        <div className="flex-1 flex py-4">
          <PostContainer>
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
