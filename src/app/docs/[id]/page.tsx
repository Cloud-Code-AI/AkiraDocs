"use client"
import React from 'react'
import { getDocById } from '@/lib/docs'
import { BlockRenderer } from '@/components/content/renderers/BlockRenderer'
import styled from 'styled-components'
import { Header } from '@/components/content/layout/Header'
import Footer from '@/components/content/layout/Footer'
import Navigation from '@/components/content/layout/Navigation'
import TableOfContents from '@/components/content/layout/TableOfContents'

const PostContainer = styled.div`
  max-width: 740px;
  margin: 0 auto;
  padding: 20px;
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

export default function DocPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const post = getDocById(unwrappedParams.id)

  // You might want to fetch these from a central configuration or API
  const navigationItems = {
    gettingStarted: {
      title: "Getting Started",
      path: "/docs/getting-started",
      items: {
        installation: { title: "Installation", path: "/docs/getting-started/installation" },
        configuration: { title: "Configuration", path: "/docs/getting-started/configuration" },
        projectStructure: { title: "Project Structure", path: "/docs/getting-started/project-structure" },
      },
    },
    coreConcepts: {
      title: "Core Concepts",
      path: "/docs/core-concepts",
      items: {
        routing: { title: "Routing", path: "/docs/core-concepts/routing" },
        dataFetching: { 
          title: "Data Fetching", 
          path: "/docs/core-concepts/data-fetching",
          items: {
            serverSide: { title: "Server-side", path: "/docs/core-concepts/data-fetching/server-side" },
            clientSide: { title: "Client-side", path: "/docs/core-concepts/data-fetching/client-side" },
          }
        },
        // ... other items
      },
    },
    // ... other top-level items
  };

  const footerData = {
    companyName: "Cloud Code AI Inc.",
    socialLinks: [
      { name: "GitHub", url: "https://github.com/your-repo", icon: "/github.svg" },
      { name: "Twitter", url: "https://twitter.com/your-account", icon: "/twitter.svg" },
      { name: "LinkedIn", url: "https://linkedin.com/company/your-company", icon: "/linkedin.svg" },
    ],
    madeWithLove: true
  }

  return (
    <div className="flex flex-col h-screen">
      <Header searchPlaceholder='Search documentation...'/>
      <div className="flex flex-grow">
        <Navigation items={navigationItems} />
        <div className="flex-1 flex">
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
