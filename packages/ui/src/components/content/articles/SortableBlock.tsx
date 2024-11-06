import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/components/utils'
import { BlockType } from '../../types/Block'
import { AddBlockButton } from './AddBlockButton'
import { BlockRenderer } from '../renderers/BlockRenderer'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Trash2, Upload } from 'lucide-react'
import { useRef, useCallback, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface SortableBlockProps {
  block: {
    id: string
    type: BlockType
    content: string
  }
  updateBlock: (id: string, content: string) => void
  changeBlockType: (id: string, newType: BlockType) => void
  addBlock: (afterId: string) => void
  deleteBlock: (id: string) => void
  showPreview: boolean
  isChangeTypeActive: boolean
  setActiveChangeTypeId: (id: string | null) => void
}

interface ImageBlockContent {
  url: string
  alt?: string
  caption?: string
  alignment?: 'left' | 'center' | 'right'
  size?: 'small' | 'medium' | 'large' | 'full'
}


export function SortableBlock({
  block,
  updateBlock,
  changeBlockType,
  addBlock,
  deleteBlock,
  showPreview,
  isChangeTypeActive,
  setActiveChangeTypeId
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id })

  const inputRef = useRef<HTMLDivElement>(null)
  const addBlockButtonRef = useRef<HTMLButtonElement>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === '/') {
      requestAnimationFrame(() => {
        setActiveChangeTypeId(block.id)
        addBlockButtonRef.current?.click()
        inputRef.current?.focus()
      })
    }
  }, [block.id, setActiveChangeTypeId])

  const handleInput = useCallback((e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (!target) return

    const content = target.textContent || ''
    const lastTwoChars = content.slice(-2)
    
    if (lastTwoChars.length === 2 && lastTwoChars[0] === '/' && lastTwoChars[1] !== '/') {
      setIsDropdownOpen(false)
      setActiveChangeTypeId(null)
      
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus()
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(inputRef.current)
          range.collapse(false)
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      }, 0)
    }
  }, [setActiveChangeTypeId, block.type])

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setActiveChangeTypeId(block.id)
    } else {
      setActiveChangeTypeId(null)
    }
  }

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const imageUrl = URL.createObjectURL(file)
    
    const imageContent: ImageBlockContent = {
      url: imageUrl,
      alt: '',
      caption: '',
      alignment: 'center',
      size: 'medium'
    }
    
    updateBlock(block.id, JSON.stringify(imageContent))
  }

  const getImageContent = (): ImageBlockContent => {
    if (!block.content) {
      return {
        url: '',
        alt: '',
        caption: '',
        alignment: 'center',
        size: 'medium'
      }
    }

    try {
      return typeof block.content === 'string' 
        ? JSON.parse(block.content)
        : block.content
    } catch {
      return {
        url: block.content as string,
        alt: '',
        caption: '',
        alignment: 'center',
        size: 'medium'
      }
    }
  }

  const updateImageMetadata = (metadata: Partial<ImageBlockContent>) => {
    const currentContent = getImageContent()
    const updatedContent = {
      ...currentContent,
      ...metadata
    }
    updateBlock(block.id, JSON.stringify(updatedContent))
  }

  if (showPreview) {
    return <BlockRenderer block={block} />
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative mb-4',
        isDragging && 'z-50 bg-background/50 backdrop-blur-sm'
      )}
    >
      <div className="flex items-center gap-2">
        {/* Drag Handle */}
        <div
          className="flex-shrink-0 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground"
          >
            <GripVertical className="h-4 w-4" />
            <span className="sr-only">Drag handle</span>
          </Button>
        </div>

        {/* Block Controls */}
        <div className="flex items-center gap-1">
          <AddBlockButton 
            ref={addBlockButtonRef}
            onChangeType={(type) => {
              changeBlockType(block.id, type)
              if (inputRef.current) {
                inputRef.current.textContent = ''
                inputRef.current.focus()
              }
            }} 
            mode="change"
            isActive={isChangeTypeActive}
            onOpenChange={(open) => {
              setIsDropdownOpen(open)
              handleOpenChange(open)
            }}
            open={isDropdownOpen}
            type={block.type}
          />
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => addBlock(block.id)}
          >
            <Plus size={16} />
            <span className="sr-only">Add Block</span>
          </Button>
        </div>

        {/* Content Editor */}
        <div className="flex-grow">
          { block.type === 'image' ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              {getImageContent().url ? (
                <div className="space-y-4">
                  <div className={cn(
                    "flex flex-col gap-2",
                    getImageContent().alignment === 'left' && "items-start",
                    getImageContent().alignment === 'center' && "items-center",
                    getImageContent().alignment === 'right' && "items-end",
                  )}>
                    <img 
                      src={getImageContent().url} 
                      alt={getImageContent().alt} 
                      className={cn(
                        "h-auto rounded-lg",
                        getImageContent().size === 'small' && "max-w-[300px]",
                        getImageContent().size === 'medium' && "max-w-[500px]",
                        getImageContent().size === 'large' && "max-w-[800px]",
                        getImageContent().size === 'full' && "max-w-full",
                      )}
                    />
                    {getImageContent().caption && (
                      <p className="text-sm text-muted-foreground italic">
                        {getImageContent().caption}
                      </p>
                    )}
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="alt-text">Alt Text</Label>
                        <Input
                          id="alt-text"
                          placeholder="Describe the image..."
                          value={getImageContent().alt}
                          onChange={(e) => updateImageMetadata({ alt: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="caption">Caption</Label>
                        <Input
                          id="caption"
                          placeholder="Add a caption..."
                          value={getImageContent().caption}
                          onChange={(e) => updateImageMetadata({ caption: e.target.value })}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label>Alignment</Label>
                        <Select
                          value={getImageContent().alignment}
                          onValueChange={(value) => 
                            updateImageMetadata({ 
                              alignment: value as 'left' | 'center' | 'right' 
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select alignment" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="left">Left</SelectItem>
                            <SelectItem value="center">Center</SelectItem>
                            <SelectItem value="right">Right</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid gap-2">
                        <Label>Size</Label>
                        <Select
                          value={getImageContent().size || 'medium'}
                          onValueChange={(value) => 
                            updateImageMetadata({ 
                              size: value as 'small' | 'medium' | 'large' | 'full' 
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select size" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="small">Small</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="large">Large</SelectItem>
                            <SelectItem value="full">Full width</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <label className="cursor-pointer px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                        Replace Image
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer py-8">
                  <Upload className="w-12 h-12 text-muted-foreground" />
                  <span className="mt-2 text-sm text-muted-foreground">Click to upload an image</span>
                  <span className="mt-1 text-xs text-muted-foreground">(or drag and drop)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          ) : block.type === 'divider' ? (
            <div className="py-2">
              <hr className="border-t border-border" />
            </div>
          ) : (
            <div
              ref={inputRef}
              contentEditable
              suppressContentEditableWarning
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              onBlur={(e) => {
                const target = e.target as HTMLElement
                if (!target) return

                setTimeout(() => {
                  updateBlock(block.id, target.textContent || '')
                }, 100)
              }}
              className={cn(
                "w-full p-2 focus:outline-none border border-transparent focus:border-border rounded-md bg-gray-800",
                block.type === 'heading' && "font-bold text-2xl",
                block.type === 'code' && "font-mono bg-muted p-4"
              )}
              style={{
                display: 'block',
                whiteSpace: block.type === 'code' ? 'pre-wrap' : 'normal'
              }}
            >
              {block.content}
            </div>
          )}
        </div>

        {/* Block Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => deleteBlock(block.id)}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete block</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
} 