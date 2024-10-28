"use client"
import React from 'react'
import { getArticleBySlug } from '@/lib/articles'
import { BlockRenderer } from '@/components/content/renderers/BlockRenderer'
import styled from 'styled-components'
import { Header } from '@/components/content/layout/Header'
import Footer from '@/components/content/layout/Footer'
import Navigation from '@/components/content/layout/Navigation'
import TableOfContents from '@/components/content/layout/TableOfContents'
import { getNavigation, getFooterData } from '@/lib/getNavigation'

const PostContainer = styled.div`
  max-width: 56rem; // This is equivalent to max-w-4xl
  margin: 0 auto;
  padding: 1rem 1.5rem; // Equivalent to px-4 sm:px-6
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
`

const Title = styled.h1`
  text-align: center;
  font-size: 2.5em;
  color: #333;
  margin-bottom: 0.3em;
`

const Metadata = styled.p`
  text-align: center;
  color: #666;
  font-size: 0.9em;
  margin-bottom: 2em;
`

export default function ArticlePage({ params }: { params: Promise<{ slug: string[] }> }) {
  const resolvedParams = React.use(params)
  const slug = resolvedParams.slug.join('/')
  const post = getArticleBySlug(slug)
  // const post = getDocById(slug)

  // Load navigation items from _meta.json
  const navigationItems = getNavigation({})

  // You might want to fetch these from a central configuration or API
  const footerData = getFooterData({})

  return (
    <div className="flex flex-col h-screen">
      <Header searchPlaceholder='Search articles...'/>
      <div className="flex flex-grow">
        <Navigation items={navigationItems} />
        <div className="flex-1 flex py-4">
          <PostContainer>
            <Title>{post.title}</Title>
            <Metadata>By {post.author} on {post.date}</Metadata>
            {post.blocks.map((block) => (
              <BlockRenderer key={block.id} block={block} />
            ))}
          </PostContainer>
          <TableOfContents />
        </div>
      </div>
      <Footer {...footerData} />
    </div>
  )
}
