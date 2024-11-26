import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Block, BlockType } from '../../types/Block'
import { AddBlockButton } from '../editor/AddBlockButton'
import { BlockRenderer } from '@/lib/renderers/BlockRenderer'
import { Plus, Trash2, Upload } from 'lucide-react'
import { useRef, useCallback, useState } from 'react'
import { BlockFormatToolbar } from '../editor/BlockFormatToolbar'

interface SortableBlockProps {
  block: {
    id: string
    type: BlockType
    content: string
    metadata?: {
      level?: number
      styles?: {
        bold?: boolean
        italic?: boolean
        underline?: boolean
      }
      language?: string
      alt?: string
      caption?: string
      listType?: 'ordered' | 'unordered'
      size?: 'small' | 'medium' | 'large' | 'full'
      position?: 'left' | 'center' | 'right'
      filename?: string
      showLineNumbers?: boolean
      align?: 'left' | 'center' | 'right'
      type?: 'info' | 'warning' | 'success' | 'error'
      title?: string
    }
  }
  updateBlock: (id: string, content: string) => void
  changeBlockType: (id: string, newType: BlockType) => void
  addBlock: (afterId: string) => void
  deleteBlock: (id: string) => void
  showPreview: boolean
  isChangeTypeActive: boolean
  setActiveChangeTypeId: (id: string | null) => void
  updateBlockMetadata: (id: string, metadata: Partial<Block['metadata']>) => void
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
  setActiveChangeTypeId,
  updateBlockMetadata
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

  return showPreview ? (
    <BlockRenderer block={block} />
  ) : (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group relative',
        isDragging && 'z-50 bg-background/50 backdrop-blur-sm'
      )}
    >
      {/* Left Controls Container */}
      <div className="absolute -left-32 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
        {/* Drag Handle */}
        <div
          className="flex-shrink-0 cursor-grab active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            <GripVertical className="h-4 w-4" />
            <span className="sr-only">Drag handle</span>
          </Button>
        </div>

        {/* Block Controls */}
        <div className="flex items-center gap-2">
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
      </div>

      {/* Main Content */}
      <div className="flex items-center gap-4">
        {/* Content Editor */}
        <div className="flex-grow relative">
          {!showPreview && block.type !== 'divider' && (
            <BlockFormatToolbar
              styles={block.metadata?.styles}
              align={block.type === 'image' ? getImageContent().alignment : block.metadata?.align}
              level={block.metadata?.level || 1}
              showLevelSelect={block.type === 'heading'}
              listType={block.metadata?.listType || 'unordered'}
              showListControls={block.type === 'list'}
              language={block.metadata?.language || 'typescript'}
              filename={block.metadata?.filename}
              showLineNumbers={block.metadata?.showLineNumbers ?? true}
              showCodeControls={block.type === 'code'}
              onStyleChange={(styles) => {
                updateBlockMetadata(block.id, {
                  ...block.metadata,
                  styles
                })
              }}
              onAlignChange={(newAlign) => {
                if (block.type === 'image') {
                  const currentContent = getImageContent();
                  const updatedContent = {
                    ...currentContent,
                    alignment: newAlign,  // For the image container alignment
                    position: newAlign,   // For the image position within container
                  };
                  updateBlock(block.id, JSON.stringify(updatedContent));
                } else {
                  updateBlockMetadata(block.id, {
                    ...block.metadata,
                    align: newAlign
                  });
                }
              }}
              onLevelChange={(level) => {
                updateBlockMetadata(block.id, {
                  ...block.metadata,
                  level
                })
              }}
              onListTypeChange={(listType) => {
                updateBlockMetadata(block.id, {
                  ...block.metadata,
                  listType
                })
              }}
              onLanguageChange={(language) => {
                updateBlockMetadata(block.id, {
                  ...block.metadata,
                  language
                })
              }}
              onFilenameChange={(filename) => {
                updateBlockMetadata(block.id, {
                  ...block.metadata,
                  filename
                })
              }}
              onShowLineNumbersChange={(showLineNumbers) => {
                updateBlockMetadata(block.id, {
                  ...block.metadata,
                  showLineNumbers
                })
              }}
              showImageControls={block.type === 'image'}
              imageContent={block.type === 'image' ? getImageContent() : undefined}
              onImageMetadataChange={(metadata) => {
                const currentContent = getImageContent();
                const updatedContent = {
                  ...currentContent,
                  ...metadata
                };
                updateBlock(block.id, JSON.stringify(updatedContent));
              }}
              showCalloutControls={block.type === 'callout'}
              calloutType={block.metadata?.type || 'info'}
              calloutTitle={block.metadata?.title || ''}
              onCalloutTypeChange={(type) => {
                updateBlockMetadata(block.id, {
                  ...block.metadata,
                  type
                });
              }}
              onCalloutTitleChange={(title) => {
                updateBlockMetadata(block.id, {
                  ...block.metadata,
                  title
                });
              }}
            />
          )}
          <BlockRenderer 
            block={block} 
            isEditing={true}
            onUpdate={(id, content) => updateBlock(id, content)}
          />
        </div>

        {/* Delete Button */}
        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
            onClick={() => deleteBlock(block.id)}
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete block</span>
          </Button>
        </div>
      </div>
    </div>
  )
} 
