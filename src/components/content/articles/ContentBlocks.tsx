'use client'

import React, { useState } from 'react'
import { BlockRenderer } from '../renderers/BlockRenderer'
import { Block } from '@/types/Block'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Trash2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface ContentBlocksProps {
  blocks: Block[]
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
  showPreview: boolean
}

export function ContentBlocks({ blocks, setBlocks, showPreview }: ContentBlocksProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)

  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ))
  }

  const updateBlockMetadata = (id: string, metadata: Partial<Block['metadata']>) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, metadata: { ...block.metadata, ...metadata } } : block
    ))
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  const applyStyle = (style: 'bold' | 'italic' | 'underline') => {
    if (selectedBlockId) {
      const block = blocks.find(b => b.id === selectedBlockId)
      if (block) {
        const newContent = `<${style}>${block.content}</${style}>`
        updateBlockContent(selectedBlockId, newContent)
      }
    }
  }

  const applyAlignment = (align: 'left' | 'center' | 'right') => {
    if (selectedBlockId) {
      updateBlockMetadata(selectedBlockId, { align })
    }
  }

  return (
    <div className="space-y-4">
      {!showPreview && (
        <div className="flex space-x-2 mb-4">
          <Button variant="outline" size="icon" onClick={() => applyStyle('bold')}>
            <Bold className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => applyStyle('italic')}>
            <Italic className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => applyStyle('underline')}>
            <Underline className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => applyAlignment('left')}>
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => applyAlignment('center')}>
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => applyAlignment('right')}>
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      )}
      {blocks.map((block) => (
        <div key={block.id} className="relative">
          {!showPreview && (
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={`block-${block.id}`} className="text-sm font-medium">
                {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
              </Label>
              <div className="flex items-center space-x-2">
              {block.type === 'heading' && (
                <Select
                  value={String(block.metadata?.level || 1)}
                  onValueChange={(value) => updateBlockMetadata(block.id, { level: parseInt(value) })}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((level) => (
                      <SelectItem key={level} value={String(level)}>
                        H{level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeBlock(block.id)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Remove block</span>
                </Button>
              </div>
            </div>
          )}
          {showPreview ? (
            <BlockRenderer block={block} />
          ) : (
            block.type === 'heading' ? (
              <Input
                id={`block-${block.id}`}
                value={block.content}
                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                onFocus={() => setSelectedBlockId(block.id)}
                placeholder={`Enter heading content...`}
                className={`w-full text-${block.metadata?.align || 'left'}`}
              />
            ) : (
              <Textarea
                id={`block-${block.id}`}
                value={block.content}
                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                onFocus={() => setSelectedBlockId(block.id)}
                placeholder={`Enter ${block.type} content...`}
                className={`w-full min-h-[100px] resize-y text-${block.metadata?.align || 'left'}`}
              />
            )
          )}
        </div>
      ))}
    </div>
  )
}
