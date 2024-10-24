'use client'

import { useState } from 'react'
import { TitleBar } from '@/components/content/articles/TitleBar'
import { ArticleHeaders } from '@/components/content/articles/ArticleHeaders'
import { ContentBlocks } from '@/components/content/articles/ContentBlocks'
import { AddBlockButton } from '@/components/content/articles/AddBlockButton'
import { Block, BlockType } from '@/types/Block'

export default function Article() {
  const [blocks, setBlocks] = useState<Block[]>([{ id: '1', type: 'paragraph', content: '' }])
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
      metadata: {}
    }
    setBlocks([...blocks, newBlock])
  }

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
          <ContentBlocks blocks={blocks} setBlocks={setBlocks} showPreview={showPreview} />
          {!showPreview && (
            <div className="mt-4">
              <AddBlockButton onAddBlock={addBlock} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
