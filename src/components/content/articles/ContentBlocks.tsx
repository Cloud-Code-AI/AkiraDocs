'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { Bold, Italic, Code, List, ListOrdered, AlignLeft, X } from 'lucide-react'
import { cn } from "@/lib/utils"

type Block = {
  id: string
  type: 'text' | 'heading' | 'image'
  content: string
}

type FormattingOption = 'bold' | 'italic' | 'code'

interface TextBlocksProps {
  blocks: Block[]
  setBlocks: (blocks: Block[]) => void
  showPreview: boolean
}

export function ContentBlocks({ blocks, setBlocks, showPreview }: ContentBlocksProps) {
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const blockRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const addBlock = (type: Block['type']) => {
    const newBlock: Block = { id: Date.now().toString(), type, content: '' }
    setBlocks([...blocks, newBlock])
  }

  const updateBlock = useCallback((id: string, content: string) => {
    setBlocks(blocks.map(block => block.id === id ? { ...block, content } : block))
  }, [blocks, setBlocks])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>, blockId: string) => {
    const content = e.currentTarget.innerHTML
    updateBlock(blockId, content)
    setFocusedBlockId(blockId)
  }, [updateBlock])

  useEffect(() => {
    if (focusedBlockId && blockRefs.current[focusedBlockId]) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(blockRefs.current[focusedBlockId]!);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }, [focusedBlockId, blocks]);

  const applyFormatting = useCallback((option: FormattingOption) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()
    let formattedText = ''

    switch (option) {
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`
        break
      case 'italic':
        formattedText = `<em>${selectedText}</em>`
        break
      case 'code':
        formattedText = `\`${selectedText}\``
        break
    }

    const blockElement = range.startContainer.parentElement
    const blockId = blockElement?.dataset.blockId

    if (blockId) {
      const block = blocks.find(b => b.id === blockId)
      if (block) {
        const newContent = block.content.substring(0, range.startOffset) +
                           formattedText +
                           block.content.substring(range.endOffset)
        
        updateBlock(blockId, newContent)
      }
    }
  }, [blocks, updateBlock])

  const deleteBlock = useCallback((id: string) => {
    setBlocks(blocks.filter(block => block.id !== id))
  }, [blocks, setBlocks])

  const renderEditBlock = (block: Block) => {
    switch (block.type) {
      case 'text':
        return (
          <div key={block.id} className="flex items-center space-x-2 mt-2">
            <div
              ref={(el) => { blockRefs.current[block.id] = el }}
              contentEditable
              suppressContentEditableWarning
              data-block-id={block.id}
              className={cn(
                "flex-grow p-2 outline-none rounded border border-gray-200",
                focusedBlockId === block.id && "ring-2 ring-blue-200"
              )}
              onInput={(e) => handleInput(e, block.id)}
              onFocus={() => setFocusedBlockId(block.id)}
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="flex-shrink-0 hover:bg-gray-200"
              onClick={() => deleteBlock(block.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )
      // case 'heading':
      //   return (
      //     <div
      //       key={block.id}
      //       contentEditable
      //       suppressContentEditableWarning
      //       data-block-id={block.id}
      //       className="w-full mt-2 outline-none"
      //       onInput={(e) => updateBlock(block.id, e.currentTarget.textContent || '')}
      //       dangerouslySetInnerHTML={{ __html: block.content }}
      //     />
      //   )
      // case 'image':
      //   return (
      //     <Input
      //       key={block.id}
      //       value={block.content}
      //       onChange={(e) => updateBlock(block.id, e.target.value)}
      //       placeholder="Enter image URL..."
      //       className="w-full mt-2"
      //     />
      //   )
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

  if (showPreview) {
    return <>{blocks.map(block => renderViewBlock(block))}</>
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-start">
          <div className="inline-flex space-x-2 bg-gray-100 rounded-md p-1">
            <Button variant="ghost" size="icon" className="hover:bg-gray-200" onClick={() => applyFormatting('bold')}><Bold className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-200" onClick={() => applyFormatting('italic')}><Italic className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-200" onClick={() => applyFormatting('code')}><Code className="w-4 h-4" /></Button>
            {/* <Button variant="ghost" size="icon" className="hover:bg-gray-200"><List className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-200"><ListOrdered className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-200"><AlignLeft className="w-4 h-4" /></Button> */}
          </div>
        </div>
        
        {blocks.map(block => renderEditBlock(block))}
      </div>
      
      <Button variant="outline" onClick={() => addBlock('text')}>+ Add block</Button>
    </div>
  )
}
