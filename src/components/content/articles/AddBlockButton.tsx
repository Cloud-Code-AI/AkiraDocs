"use client"

import React, { useState, forwardRef, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { BlockType } from '@/types/Block'
import {
  Type,
  Heading,
  Code,
  Image,
  List,
  Minus,
  Table,
  Quote,
  ToggleLeft,
  CheckSquare,
  Video,
  Music,
  File,
  Smile,
  AlertCircle,
  Plus,
  Search,
} from 'lucide-react'

interface AddBlockButtonProps {
  onAddBlock?: (type: BlockType) => void
  onChangeType?: (type: BlockType) => void
  mode: 'add' | 'change'
  isActive?: boolean
  onOpenChange?: (open: boolean) => void
  type?: BlockType
  open?: boolean
}

interface BlockOption {
  type: BlockType
  icon: React.ReactNode
  label: string
  description: string
  group: 'Basic' | 'Media' | 'Advanced'
}

export const AddBlockButton = forwardRef<
  HTMLButtonElement,
  AddBlockButtonProps
>(({ onAddBlock, onChangeType, mode, isActive, onOpenChange, type, open }, ref) => {
  const [searchTerm, setSearchTerm] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.tabIndex = -1
    }
  }, [open])

  const blockOptions: BlockOption[] = [
    { type: 'paragraph', icon: <Type size={18} />, label: 'Text', description: 'Just start writing with plain text.', group: 'Basic' },
    { type: 'heading', icon: <Heading size={18} />, label: 'Heading', description: 'Large section heading.', group: 'Basic' },
    { type: 'list', icon: <List size={18} />, label: 'List', description: 'Create a simple bulleted list.', group: 'Basic' },
    { type: 'code', icon: <Code size={18} />, label: 'Code', description: 'Capture a code snippet.', group: 'Basic' },
    { type: 'image', icon: <Image size={18} />, label: 'Image', description: 'Upload or embed with a link.', group: 'Media' },
    { type: 'divider', icon: <Minus size={18} />, label: 'Divider', description: 'Visually divide your page.', group: 'Basic' },
    { type: 'table', icon: <Table size={18} />, label: 'Table', description: 'Add a table to your page.', group: 'Advanced' },
    { type: 'blockquote', icon: <Quote size={18} />, label: 'Quote', description: 'Capture a quote.', group: 'Basic' },
    { type: 'toggleList', icon: <ToggleLeft size={18} />, label: 'Toggle', description: 'Toggleable content.', group: 'Advanced' },
    { type: 'checkList', icon: <CheckSquare size={18} />, label: 'To-do list', description: 'Track tasks with a to-do list.', group: 'Basic' },
    { type: 'video', icon: <Video size={18} />, label: 'Video', description: 'Embed a video.', group: 'Media' },
    { type: 'audio', icon: <Music size={18} />, label: 'Audio', description: 'Embed audio content.', group: 'Media' },
    { type: 'file', icon: <File size={18} />, label: 'File', description: 'Upload or link to a file.', group: 'Media' },
    { type: 'emoji', icon: <Smile size={18} />, label: 'Emoji', description: 'Add an emoji to your page.', group: 'Basic' },
    { type: 'callout', icon: <AlertCircle size={18} />, label: 'Callout', description: 'Make writing stand out.', group: 'Advanced' },
  ]

  const filteredOptions = blockOptions.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    option.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedOptions = filteredOptions.reduce((acc, option) => {
    if (!acc[option.group]) {
      acc[option.group] = []
    }
    acc[option.group].push(option)
    return acc
  }, {} as Record<string, BlockOption[]>)

  const handleOptionClick = (type: BlockType) => {
    if (mode === 'add' && onAddBlock) {
      onAddBlock(type)
    } else if (mode === 'change' && onChangeType) {
      onChangeType(type)
    }
    onOpenChange?.(false)
  }

  const getCurrentIcon = (type: BlockType) => {
    const option = blockOptions.find(opt => opt.type === type)
    return option?.icon || <Type size={16} />
  }

  const handleSearchInput = (value: string) => {
    if (value !== '/') {
      setSearchTerm(value)
    }
  }

  return (
    <Popover 
      open={open} 
      onOpenChange={onOpenChange}
    >
      <PopoverTrigger asChild>
        <Button ref={ref} variant="outline" size="icon" className="h-8 w-8">
          {mode === 'add' ? <Plus size={16} /> : getCurrentIcon(type)}
          <span className="sr-only">{mode === 'add' ? 'Add Block' : 'Change Block Type'}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 p-0" 
        align="start"
        onOpenAutoFocus={(e) => {
          e.preventDefault()
        }}
      >
        <div className="p-4 pb-2">
          <h2 className="text-lg font-semibold mb-2">{mode === 'add' ? 'Add a block' : 'Change block type'}</h2>
          <Input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a block type"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-9 pointer-events-none bg-muted"
            tabIndex={-1}
            autoFocus={false}
          />
        </div>
        <ScrollArea className="h-[300px]">
          {Object.entries(groupedOptions).map(([group, options], groupIndex, groupArray) => (
            <div key={group}>
              <div className="px-4 py-2">
                <h3 className="mb-1 text-sm font-medium text-muted-foreground">{group}</h3>
                {options.map((option) => (
                  <Button
                    key={option.type}
                    variant="ghost"
                    className="w-full justify-start h-auto py-2 px-4 mb-1 hover:bg-accent"
                    onClick={() => handleOptionClick(option.type)}
                  >
                    <div className="flex items-start">
                      <span className="mr-3 mt-0.5 text-muted-foreground">{option.icon}</span>
                      <div className="text-left">
                        <div className="text-sm font-medium">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.description}</div>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              {groupIndex < groupArray.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
})
AddBlockButton.displayName = 'AddBlockButton'