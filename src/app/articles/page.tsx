'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { TitleBar } from '@/components/content/articles/TitleBar'
import { ArticleHeaders } from '@/components/content/articles/ArticleHeaders'
import { ContentBlocks } from '@/components/content/articles/ContentBlocks'
import { AddBlockButton } from '@/components/content/articles/AddBlockButton'
import { Block, BlockType } from '@/types/Block'
import { toast } from "sonner" // Add toast notifications (optional)

export default function Article() {
  const searchParams = useSearchParams()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const loadFileContent = async () => {
      const filePath = searchParams.get('file')
      if (!filePath) {
        // Initialize with default empty state if no file specified
        setBlocks([{ id: '1', type: 'paragraph', content: '' }])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/files?path=${encodeURIComponent(filePath)}`, {
          method: 'GET'
        })
        
        if (!response.ok) throw new Error('Failed to load file')
        
        const data = await response.json()
        
        // Set the content from the loaded file
        setTitle(data.title || '')
        setSubtitle(data.description || '')
        setBlocks(data.blocks || [{ id: '1', type: 'paragraph', content: '' }])
      } catch (error) {
        console.error('Error loading file:', error)
        // Initialize with default state if loading fails
        setBlocks([{ id: '1', type: 'paragraph', content: '' }])
      } finally {
        setIsLoading(false)
      }
    }

    loadFileContent()
  }, [searchParams])

  const addBlock = (type: BlockType) => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: '',
      metadata: {}
    }
    setBlocks([...blocks, newBlock])
  }

  const handleSave = async () => {
    const filePath = searchParams.get('file')
    if (!filePath) {
      console.error('No file path specified')
      return
    }

    setIsSaving(true)
    try {
      const content = {
        title,
        description: subtitle,
        author: "Anonymous", // You might want to make this dynamic
        date: new Date().toISOString().split('T')[0],
        blocks
      }

      const response = await fetch('/api/files', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: filePath,
          content
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save file')
      }

      toast?.success('Changes saved successfully')
    } catch (error) {
      console.error('Error saving file:', error)
      toast?.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <>
            <TitleBar 
              showPreview={showPreview} 
              setShowPreview={setShowPreview}
              onSave={handleSave}
              isSaving={isSaving}
            />
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
          </>
        )}
      </div>
    </div>
  )
}
