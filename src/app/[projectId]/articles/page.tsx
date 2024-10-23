'use client'

import { useState } from 'react'
import { TitleBar } from '@/components/articles/layout/TitleBar'
import { ArticleHeaders } from '@/components/articles/layout/ArticleHeaders'
import { TextBlocks } from '@/components/articles/layout/TextBlocks'

type Block = {
  id: string
  type: 'text' | 'heading' | 'image'
  content: string
}

export default function Article() {
  const [blocks, setBlocks] = useState<Block[]>([{ id: '1', type: 'text', content: '' }])
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <TitleBar showPreview={showPreview} setShowPreview={setShowPreview} />
        <div className="prose prose-lg max-w-none">
          <ArticleHeaders
            title={title}
            setTitle={setTitle}
            subtitle={subtitle}
            setSubtitle={setSubtitle}
            showPreview={showPreview}
          />
          <TextBlocks blocks={blocks} setBlocks={setBlocks} showPreview={showPreview} />
        </div>
      </div>
    </div>
  )
}