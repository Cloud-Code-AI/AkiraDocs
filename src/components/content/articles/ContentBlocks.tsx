'use client'

import React, { useState } from 'react'
import { BlockRenderer } from '../renderers/BlockRenderer'
import { Block } from '@/types/Block'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Trash2, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, X, Check, Plus, Smile, Minus, AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Divider } from '../blocks/Divider'
import { Checkbox } from "@/components/ui/checkbox"
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { Table } from '../blocks/Table'
import { Callout } from '../blocks/Callout'

interface ContentBlocksProps {
  blocks: Block[]
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>
  showPreview: boolean
}

export function ContentBlocks({ blocks, setBlocks, showPreview }: ContentBlocksProps) {
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null)

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

  const addChecklistItem = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'checkList') {
      const newItems = [...(block.metadata?.checkedItems || []), { text: '', checked: false }];
      updateBlockMetadata(blockId, { checkedItems: newItems });
    }
  };

  const updateChecklistItem = (blockId: string, index: number, text: string, checked: boolean) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'checkList') {
      const newItems = [...(block.metadata?.checkedItems || [])];
      newItems[index] = { text, checked };
      updateBlockMetadata(blockId, { checkedItems: newItems });
    }
  };

  const removeChecklistItem = (blockId: string, index: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'checkList') {
      const newItems = (block.metadata?.checkedItems || []).filter((_, i) => i !== index);
      updateBlockMetadata(blockId, { checkedItems: newItems });
    }
  };

  const toggleEmojiPicker = (blockId: string) => {
    setShowEmojiPicker(prevId => prevId === blockId ? null : blockId);
  };

  const handleEmojiClick = (blockId: string) => (emojiData: EmojiClickData) => {
    updateBlockContent(blockId, emojiData.emoji);
    setShowEmojiPicker(null);
  };

  const updateTableData = (blockId: string, headers: string[], rows: string[][]) => {
    updateBlockMetadata(blockId, { headers, rows });
  };

  const addTableRow = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'table') {
      const currentRows = block.metadata?.rows || [];
      const newRow = Array(block.metadata?.headers?.length || 0).fill('');
      updateBlockMetadata(blockId, { rows: [...currentRows, newRow] });
    }
  };

  const removeTableRow = (blockId: string, rowIndex: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'table') {
      const newRows = (block.metadata?.rows || []).filter((_, i) => i !== rowIndex);
      updateBlockMetadata(blockId, { rows: newRows });
    }
  };

  const addToggleListItem = (blockId: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'toggleList') {
      const newItems = [...(block.metadata?.items || []), { title: '', content: '' }];
      updateBlockMetadata(blockId, { items: newItems });
    }
  };

  const updateToggleListItem = (blockId: string, index: number, field: 'title' | 'content', value: string) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'toggleList') {
      const newItems = [...(block.metadata?.items || [])];
      newItems[index] = { ...newItems[index], [field]: value };
      updateBlockMetadata(blockId, { items: newItems });
    }
  };

  const removeToggleListItem = (blockId: string, index: number) => {
    const block = blocks.find(b => b.id === blockId);
    if (block && block.type === 'toggleList') {
      const newItems = (block.metadata?.items || []).filter((_, i) => i !== index);
      updateBlockMetadata(blockId, { items: newItems });
    }
  };

  const calloutIcons = {
    info: Info,
    warning: AlertTriangle,
    success: CheckCircle,
    error: XCircle,
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
              <div className="flex items-center space-x-2">
              {block.type === 'heading' && (
                <Select
                  value={String(block.metadata?.level || 1)}
                  onValueChange={(value) => updateBlockMetadata(block.id, { level: parseInt(value) })}
                >
                  <SelectTrigger className="w-[100px]">
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
              {block.type === 'list' && (
                <Select
                  value={block.metadata?.listType || 'unordered'}
                  onValueChange={(value) => updateBlockMetadata(block.id, { listType: value as 'ordered' | 'unordered' })}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="List type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unordered">Unordered</SelectItem>
                    <SelectItem value="ordered">Ordered</SelectItem>
                  </SelectContent>
                </Select>
              )}
              {block.type === 'code' && (
                <>
                  <Input
                    placeholder="Language"
                    value={block.metadata?.language || ''}
                    onChange={(e) => updateBlockMetadata(block.id, { language: e.target.value })}
                    className="w-28"
                  />
                  <Input
                    placeholder="Filename"
                    value={block.metadata?.filename || ''}
                    onChange={(e) => updateBlockMetadata(block.id, { filename: e.target.value })}
                    className="w-38"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateBlockMetadata(block.id, { showLineNumbers: !block.metadata?.showLineNumbers })}
                    className={block.metadata?.showLineNumbers ? 'bg-primary text-primary-foreground' : ''}
                  >
                    {block.metadata?.showLineNumbers ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                    <span>Show Line Numbers</span>
                  </Button>
                </>
              )}
              {block.type === 'emoji' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleEmojiPicker(block.id)}
                >
                  <Smile className="h-4 w-4 mr-2" />
                  {showEmojiPicker === block.id ? 'Close' : 'Choose Emoji'}
                </Button>
              )}
              {block.type === 'image' && (
                <div className="flex items-center space-x-2">
                  <Select
                    value={block.metadata?.size || 'medium'}
                    onValueChange={(value) => updateBlockMetadata(block.id, { size: value === 'medium' ? undefined : value as 'small' | 'large' | 'full' })}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                      <SelectItem value="full">Full</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
          ) : block.type === 'emoji' ? (
            <div>
              <div>
                {block.content || (
                  <span className="text-gray-400">
                    Click "Choose Emoji" to select an emoji
                  </span>
                )}
              </div>
              {showEmojiPicker === block.id && (
                <div className="z-10 mt-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick(block.id)} />
                </div>
              )}
            </div>
          ) : block.type === 'divider' ? (
            <div>
              <Divider />
            </div>
          ) : block.type === 'heading' ? (
            <Input
              id={`block-${block.id}`}
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              onFocus={() => setSelectedBlockId(block.id)}
              placeholder={`Enter heading content...`}
              className={`w-full text-${block.metadata?.align || 'left'}`}
            />
          ) : block.type === 'list' ? (
            <Textarea
              id={`block-${block.id}`}
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              onFocus={() => setSelectedBlockId(block.id)}
              placeholder="Enter list items (one per line)"
              className={`w-full min-h-[100px] resize-y text-${block.metadata?.align || 'left'}`}
            />
          ) : block.type === 'checkList' ? (
            <div className="space-y-2">
              {block.metadata?.checkedItems?.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    checked={item.checked}
                    onCheckedChange={(checked) => 
                      updateChecklistItem(block.id, index, item.text, checked as boolean)
                    }
                  />
                  <Input
                    value={item.text}
                    onChange={(e) => updateChecklistItem(block.id, index, e.target.value, item.checked)}
                    placeholder="List item"
                    className="flex-grow"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeChecklistItem(block.id, index)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addChecklistItem(block.id)}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
          ) : block.type === 'table' ? (
            <div className="space-y-2">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter headers (comma-separated)"
                  value={block.metadata?.headers?.join(', ') || ''}
                  onChange={(e) => {
                    const headers = e.target.value.split(',').map(h => h.trim());
                    updateTableData(block.id, headers, block.metadata?.rows || []);
                  }}
                  className="flex-grow"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addTableRow(block.id)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Row
                </Button>
              </div>
              {block.metadata?.rows?.map((row, rowIndex) => (
                <div key={rowIndex} className="flex items-center space-x-2">
                  {row.map((cell, cellIndex) => (
                    <Input
                      key={cellIndex}
                      value={cell}
                      onChange={(e) => {
                        const newRows = [...(block.metadata?.rows || [])];
                        newRows[rowIndex][cellIndex] = e.target.value;
                        updateTableData(block.id, block.metadata?.headers || [], newRows);
                      }}
                      placeholder={`Cell ${cellIndex + 1}`}
                      className="flex-grow"
                    />
                  ))}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTableRow(block.id, rowIndex)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : block.type === 'toggleList' ? (
            <div className="space-y-2">
              {block.metadata?.items?.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={item.title}
                      onChange={(e) => updateToggleListItem(block.id, index, 'title', e.target.value)}
                      placeholder="Toggle title"
                      className="flex-grow"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeToggleListItem(block.id, index)}
                      className="h-8 w-8 text-destructive hover:text-destructive"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Textarea
                    value={item.content}
                    onChange={(e) => updateToggleListItem(block.id, index, 'content', e.target.value)}
                    placeholder="Toggle content"
                    className="w-full min-h-[100px] resize-y"
                  />
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addToggleListItem(block.id)}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Toggle Item
              </Button>
            </div>
          ) : block.type === 'callout' ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Select
                  value={block.metadata?.type || 'info'}
                  onValueChange={(value) => updateBlockMetadata(block.id, { type: value as 'info' | 'warning' | 'success' | 'error' })}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select callout type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  placeholder="Callout title (optional)"
                  value={block.metadata?.title || ''}
                  onChange={(e) => updateBlockMetadata(block.id, { title: e.target.value })}
                  className="flex-grow"
                />
              </div>
              <Textarea
                value={block.content}
                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                placeholder="Enter callout content..."
                className="w-full min-h-[100px] resize-y"
              />
            </div>
          ) : block.type === 'image' ? (
            <div className="space-y-2">
              <Input
                placeholder="Enter image URL"
                value={block.content}
                onChange={(e) => updateBlockContent(block.id, e.target.value)}
                className="flex-grow"
              />
              <Input
                placeholder="Alt text (optional)"
                value={block.metadata?.alt || ''}
                onChange={(e) => updateBlockMetadata(block.id, { alt: e.target.value })}
              />
              <Input
                placeholder="Caption (optional)"
                value={block.metadata?.caption || ''}
                onChange={(e) => updateBlockMetadata(block.id, { caption: e.target.value })}
              />
            </div>
          ) : (
            <Textarea
              id={`block-${block.id}`}
              value={block.content}
              onChange={(e) => updateBlockContent(block.id, e.target.value)}
              onFocus={() => setSelectedBlockId(block.id)}
              placeholder={`Enter ${block.type} content...`}
              className={`w-full min-h-[100px] resize-y text-${block.metadata?.align || 'left'}`}
            />
          )}
        </div>
      ))}
    </div>
  )
}
