import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BlockType } from '@/types/Block'
import { AddBlockButton } from './AddBlockButton'
import { BlockRenderer } from '../renderers/BlockRenderer'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react'
import { useRef } from 'react'

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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