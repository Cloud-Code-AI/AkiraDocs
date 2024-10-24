"use client"
import React from 'react'
import { getDocById } from '@/lib/docs'
import { BlockRenderer } from '@/components/content/renderers/BlockRenderer'
import styled from 'styled-components'

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

  return (
    <PostContainer>
      <Title>{post.title}</Title>
      <Metadata>By {post.author} on {post.date}</Metadata>
      {post.blocks.map((block) => (
        <BlockRenderer key={block.id} block={block} />
      ))}
    </PostContainer>
  )
}
