'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { AddBlockButton } from '@/components/content/articles/AddBlockButton'
import { BlockType } from '@/types/Block'
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArticleHeaders } from '@/components/content/articles/ArticleHeaders'
import { TitleBar } from '@/components/content/articles/TitleBar'
import { BlockRenderer } from '@/components/content/renderers/BlockRenderer'

type Block = {
  id: string
  type: BlockType
  content: string
}

export default function ArticleEditor() {
  const searchParams = useSearchParams()
  const [blocks, setBlocks] = useState<Block[]>([])
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [activeChangeTypeId, setActiveChangeTypeId] = useState<string | null>(null)

  useEffect(() => {
    const loadFileContent = async () => {
      const filePath = searchParams.get('file')
      if (!filePath) {
        setBlocks([{ id: '1', type: 'paragraph', content: '' }])
        setIsLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/files?path=${encodeURIComponent(filePath)}`)
        if (!response.ok) throw new Error('Failed to load file')
        const data = await response.json()
        setTitle(data.title || '')
        setSubtitle(data.description || '')
        setBlocks(data.blocks || [{ id: '1', type: 'paragraph', content: '' }])
      } catch (error) {
        console.error('Error loading file:', error)
        setBlocks([{ id: '1', type: 'paragraph', content: '' }])
      } finally {
        setIsLoading(false)
      }
    }

    loadFileContent()
  }, [searchParams])

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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: filePath, content })
      })

      if (!response.ok) throw new Error('Failed to save file')
      toast.success('Changes saved successfully')
    } catch (error) {
      console.error('Error saving file:', error)
      toast.error('Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  const addBlock = (afterId: string) => {
    const newBlock: Block = { 
      id: Date.now().toString(), 
      type: 'paragraph', 
      content: '' 
    }
    
    if (afterId === 'new') {
      // Adding first block
      setBlocks([newBlock])
    } else {
      // Adding block after existing block
      const index = blocks.findIndex(block => block.id === afterId)
      setBlocks([...blocks.slice(0, index + 1), newBlock, ...blocks.slice(index + 1)])
    }
    setActiveChangeTypeId(newBlock.id)
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, content } : block))
  }

  const changeBlockType = (id: string, newType: BlockType) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, type: newType } : block))
    setActiveChangeTypeId(null)
  }

  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
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
          {blocks.map((block, index) => (
            <BlockComponent
              key={block.id}
              block={block}
              updateBlock={updateBlock}
              changeBlockType={changeBlockType}
              addBlock={addBlock}
              deleteBlock={deleteBlock}
              showPreview={showPreview}
              isChangeTypeActive={activeChangeTypeId === block.id}
              setActiveChangeTypeId={setActiveChangeTypeId}
            />
          ))}
          {blocks.length === 0 && !showPreview && (
            <div className="flex justify-center my-8">
              <Button
                onClick={() => addBlock('new')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Plus size={16} />
                Add Block
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

type BlockComponentProps = {
  block: Block
  updateBlock: (id: string, content: string) => void
  changeBlockType: (id: string, newType: BlockType) => void
  addBlock: (afterId: string) => void
  deleteBlock: (id: string) => void
  showPreview: boolean
  isChangeTypeActive: boolean
  setActiveChangeTypeId: (id: string | null) => void
}

function BlockComponent({ 
  block, 
  updateBlock, 
  changeBlockType, 
  addBlock, 
  deleteBlock,
  showPreview,
  isChangeTypeActive,
  setActiveChangeTypeId
}: BlockComponentProps) {
  const inputRef = useRef<HTMLDivElement>(null)

  if (showPreview) {
    return <BlockRenderer block={block} />
  }

  return (
    <div className="group relative mb-4 flex items-start">
      <div className="flex items-center space-x-1 mr-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => addBlock(block.id)}
        >
          <Plus size={16} />
          <span className="sr-only">Add Block</span>
        </Button>
        <AddBlockButton 
          onChangeType={(type) => changeBlockType(block.id, type)} 
          mode="change"
          isActive={isChangeTypeActive}
          onOpenChange={(open) => {
            if (open) {
              setActiveChangeTypeId(block.id)
            } else {
              setActiveChangeTypeId(null)
            }
          }}
        />
      </div>
      <div className="flex-grow">
        <div
          ref={inputRef}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => updateBlock(block.id, e.currentTarget.textContent || '')}
          className={`w-full p-2 focus:outline-none border border-transparent focus:border-gray-300 rounded-md ${
            block.type === 'heading' ? 'font-bold text-2xl' : ''
          }`}
        >
          {block.content}
        </div>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity ml-2"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => deleteBlock(block.id)}>
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete block</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}