import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

interface SpacerBlockProps {
  size?: 'small' | 'medium' | 'large' | 'xlarge'
  isEditing?: boolean
  onUpdate?: (size: string) => void
}

const spacingSizes = {
  small: 'h-4',
  medium: 'h-8',
  large: 'h-16',
  xlarge: 'h-24'
}

export function SpacerBlock({ size = 'medium', isEditing, onUpdate }: SpacerBlockProps) {
  const [isFocused, setIsFocused] = useState(false)

  if (!isEditing) {
    return <div className={cn('w-full', spacingSizes[size])} />
  }

  return (
    <div 
      className="flex items-center gap-2 py-2"
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          setIsFocused(false)
        }
      }}
    >
      <div className={cn(
        'flex-grow border-2 border-dashed rounded transition-colors duration-200',
        spacingSizes[size],
        isFocused ? 'border-muted-foreground/20' : 'border-transparent'
      )} />
      {isFocused && (
        <Select
          value={size}
          onValueChange={(value) => onUpdate?.(value)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
            <SelectItem value="xlarge">Extra Large</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  )
} 