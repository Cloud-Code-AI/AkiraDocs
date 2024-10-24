'use client'

import React from 'react'
import { BlockRenderer } from '../renderers/BlockRenderer'
import { Block } from '@/types/Block'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Trash2 } from 'lucide-react'

interface ContentBlocksProps {
  blocks: Block[]
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
  showPreview: boolean
}

export function ContentBlocks({ blocks, setBlocks, showPreview }: ContentBlocksProps) {
  const updateBlockContent = (id: string, content: string) => {
    setBlocks(blocks.map(block => 
      block.id === id ? { ...block, content } : block
    ))
  }

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }

  return (
    <div className="space-y-4">
      {blocks.map((block) => (
        <div key={block.id} className="relative">
          {!showPreview && (
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor={`block-${block.id}`} className="text-sm font-medium">
                {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
              </Label>
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
          )}
          {showPreview ? (
            <BlockRenderer block={block} />
          ) : (
            <Textarea
              id={`block-${block.id}`}
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              placeholder={`Enter ${block.type} content...`}
              className="w-full min-h-[100px] resize-y"
            />
          )}
        </div>
      ))}
    </div>
  )
}