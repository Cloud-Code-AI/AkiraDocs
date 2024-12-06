"use client"

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ImagePlus } from 'lucide-react'
import { useState } from 'react'

interface ImageBlockProps {
  content: string
  id: string
  onUpdate?: (content: string) => void
  isEditing?: boolean
  metadata?: {
    alt?: string
    caption?: string
    alignment?: 'left' | 'center' | 'right'
    size?: 'small' | 'medium' | 'large' | 'full'
  }
}

export function ImageBlock({ content, id, onUpdate, isEditing, metadata }: ImageBlockProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    
    const imageContent = JSON.stringify({
      url,
      alt: metadata?.alt || file.name,
      caption: metadata?.caption,
      alignment: metadata?.alignment || 'center',
      size: metadata?.size || 'medium'
    })

    onUpdate?.(imageContent)
  }

  // Helper function to parse content
  const parseImageContent = (content: string) => {
    try {
      // Try parsing as JSON first
      return typeof content === 'string' ? JSON.parse(content) : content
    } catch {
      // If parsing fails, assume it's a direct URL string
      return {
        url: content,
        alt: metadata?.alt || '',
        caption: metadata?.caption || '',
        alignment: metadata?.alignment || 'center',
        size: metadata?.size || 'medium'
      }
    }
  }

  const UploadButton = () => (
    <div className="text-center">
      <input
        type="file"
        id={`image-upload-${id}`}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />
      <div className="flex flex-col items-center gap-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-auto py-6 px-8 hover:bg-accent flex flex-col items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            document.getElementById(`image-upload-${id}`)?.click()
          }}
        >
          <ImagePlus className="h-8 w-8 text-muted-foreground" />
          <span className="font-medium">Upload Image</span>
          <p className="text-sm text-muted-foreground">
            Click to upload or drag and drop
          </p>
        </Button>
      </div>
    </div>
  )

  if (!content && isEditing) {
    return (
      <div className="flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg my-4">
        <UploadButton />
      </div>
    )
  }

  const imageContent = parseImageContent(content)

  return (
    <figure 
      className={cn(
        "py-1 mb-6 relative group",
        imageContent.alignment === 'left' && "text-left",
        imageContent.alignment === 'center' && "text-center",
        imageContent.alignment === 'right' && "text-right",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative inline-block">
        <img 
          src={imageContent.url} 
          alt={imageContent.alt} 
          className={cn(
            "h-auto rounded-lg",
            imageContent.size === 'small' && "max-w-[300px]",
            imageContent.size === 'medium' && "max-w-[500px]",
            imageContent.size === 'large' && "max-w-[800px]",
            imageContent.size === 'full' && "max-w-full",
          )}
        />
        {isEditing && isHovered && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              id={`image-change-${id}`}
              className="hidden"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <Button
              variant="secondary"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation()
                document.getElementById(`image-change-${id}`)?.click()
              }}
            >
              <ImagePlus className="h-4 w-4" />
              Change Image
            </Button>
          </div>
        )}
      </div>
      {imageContent.caption && (
        <figcaption className="mt-2 text-sm text-muted-foreground italic">
          {imageContent.caption}
        </figcaption>
      )}
    </figure>
  )
}
