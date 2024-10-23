'use client'

import { useState, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Bold, Italic, Code, List, ListOrdered, AlignLeft, Image, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

type Block = {
  id: string
  type: 'text' | 'heading' | 'image'
  content: string
}

type FormattingOption = 'bold' | 'italic' | 'code'

export function BlogEditorComponent() {
  const [blocks, setBlocks] = useState<Block[]>([{ id: '1', type: 'text', content: '' }])
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = { id: Date.now().toString(), type, content: '' }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = (id: string, content: string) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, content } : block))
  }

  const applyFormatting = useCallback((option: FormattingOption) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    let formattedText = ''

    switch (option) {
      case 'bold':
        formattedText = `**${selectedText}**`
        break
      case 'italic':
        formattedText = `*${selectedText}*`
        break
      case 'code':
        formattedText = `\`${selectedText}\``
        break
    }

    const newText = range.startContainer.textContent?.slice(0, range.startOffset) +
                    formattedText +
                    range.startContainer.textContent?.slice(range.endOffset)

    const blockId = (range.startContainer.parentElement as HTMLElement).dataset.blockId
    if (blockId) {
      updateBlock(blockId, newText || '')
    }
  }, [])

  const renderEditBlock = (block: Block) => {
    switch (block.type) {
      case 'text':
      case 'heading':
        return (
          <div
            key={block.id}
            contentEditable
            suppressContentEditableWarning
            data-block-id={block.id}
            className="w-full mt-2 outline-none"
            onInput={(e) => updateBlock(block.id, e.currentTarget.textContent || '')}
            dangerouslySetInnerHTML={{ __html: block.content }}
          />
        )
      case 'image':
        return (
          <Input
            key={block.id}
            value={block.content}
            onChange={(e) => updateBlock(block.id, e.target.value)}
            placeholder="Enter image URL..."
            className="w-full mt-2"
          />
        )
    }
  }

  const renderViewBlock = (block: Block) => {
    const formatText = (text: string) => {
      return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`(.*?)`/g, '<code>$1</code>')
    }

    switch (block.type) {
      case 'text':
        return <p key={block.id} className="my-4" dangerouslySetInnerHTML={{ __html: formatText(block.content) }} />
      case 'heading':
        return <h2 key={block.id} className="text-2xl font-bold my-4" dangerouslySetInnerHTML={{ __html: formatText(block.content) }} />
      case 'image':
        return <img key={block.id} src={block.content} alt="Blog content" className="my-4 max-w-full h-auto" />
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="#" className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold">Draft article</h1>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </Button>
        </div>
        
        {!showPreview ? (
          <>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Article title"
              className="text-4xl font-bold mb-4 border-none px-0"
            />
            <Input
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Add a subtitle"
              className="text-xl mb-4 border-none px-0"
            />
            <Button variant="outline" className="mb-4">
              <Image className="w-4 h-4 mr-2" />
              Add featured image (1200x630px)
            </Button>
            <div className="flex space-x-2 mb-4">
              <Button variant="ghost" size="icon" onClick={() => applyFormatting('bold')}><Bold className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => applyFormatting('italic')}><Italic className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => applyFormatting('code')}><Code className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><List className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><ListOrdered className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon"><AlignLeft className="w-4 h-4" /></Button>
            </div>
            {blocks.map(block => renderEditBlock(block))}
            <Button variant="ghost" className="mt-4" onClick={() => addBlock('text')}>+ Add block</Button>
          </>
        ) : (
          <div className="prose prose-lg max-w-none">
            <h1 className="text-4xl font-bold mb-2">{title}</h1>
            <h2 className="text-xl mb-4">{subtitle}</h2>
            {blocks.map(block => renderViewBlock(block))}
          </div>
        )}
      </div>
    </div>
  )
}