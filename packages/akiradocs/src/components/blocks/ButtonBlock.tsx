import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { useState } from "react"

interface ButtonBlockProps {
  content: string
  metadata?: {
    buttonUrl?: string
    buttonStyle?: {
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
      size?: 'default' | 'sm' | 'lg'
      radius?: 'none' | 'sm' | 'md' | 'lg' | 'full'
    }
  }
  isEditing?: boolean
  onUpdate?: (content: string) => void
  align?: 'left' | 'center' | 'right'
}

export function ButtonBlock({ 
  content, 
  metadata, 
  isEditing,
  onUpdate,
  align = 'left'
}: ButtonBlockProps) {
  const [isFocused, setIsFocused] = useState(false);
  const buttonStyle = metadata?.buttonStyle || {}
  const url = metadata?.buttonUrl || '#'
  
  const buttonClasses = cn(
    "relative",
    {
      'rounded-none': buttonStyle.radius === 'none',
      'rounded-sm': buttonStyle.radius === 'sm',
      'rounded-md': buttonStyle.radius === 'md',
      'rounded-lg': buttonStyle.radius === 'lg',
      'rounded-full': buttonStyle.radius === 'full',
      'w-full': buttonStyle.size === 'lg',
      'w-24': buttonStyle.size === 'sm',
      'w-auto': buttonStyle.size === 'default'
    }
  )

  const wrapperClasses = cn(
    'w-full',
    {
      'text-left': align === 'left',
      'text-center': align === 'center',
      'text-right': align === 'right'
    }
  )

  if (isEditing) {
    return (
      <div className={wrapperClasses}>
        <div className="relative inline-block">
          <Button
            variant={buttonStyle.variant || 'default'}
            size={buttonStyle.size || 'default'}
            className={cn(buttonClasses, isFocused && "invisible")}
            type="button"
          >
            {content || 'Button text...'}
          </Button>
          <input
            value={content}
            onChange={(e) => onUpdate?.(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={cn(
              buttonVariants({ 
                variant: buttonStyle.variant || 'default', 
                size: buttonStyle.size || 'default'
              }),
              buttonClasses,
              "absolute inset-0 border-0 outline-none",
              !isFocused && "opacity-0"
            )}
            placeholder="Button text..."
          />
        </div>
      </div>
    )
  }

  return (
    <div className={wrapperClasses}>
        <div className="relative inline-block">
            <Button
                variant={buttonStyle.variant || 'default'}
                size={buttonStyle.size || 'default'}
                className={buttonClasses}
                asChild
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
            {content}
          </a>
        </Button>
      </div>    
    </div>
  )
} 