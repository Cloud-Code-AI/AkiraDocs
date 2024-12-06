"use client"

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Music, Pause, Play } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { saveAudioToPublic } from '@/lib/fileUtils'

interface AudioBlockProps {
  content: string
  id: string
  onUpdate?: (content: string) => void
  isEditing?: boolean
  metadata?: {
    caption?: string
    alignment?: 'left' | 'center' | 'right'
    styles?: {
      bold?: boolean
      italic?: boolean
      underline?: boolean
    }
  }
}

interface AudioBlockContent {
  url: string
  caption?: string
  alignment?: 'left' | 'center' | 'right'
}

export function AudioBlock({ content, id, onUpdate, isEditing, metadata }: AudioBlockProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Add event listeners to sync the isPlaying state with audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)
    audio.addEventListener('ended', handleEnded)

    return () => {
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
      audio.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const filename = await saveAudioToPublic(file, content) 
      
      const audioContent = JSON.stringify({
        url: `/${filename}`,
        caption: metadata?.caption,
        alignment: metadata?.alignment || 'center'
      })

      onUpdate?.(audioContent)
    } catch (error) {
      console.error('Failed to upload audio:', error)
    }
  }

  const parseAudioContent = (content: string): AudioBlockContent => {
    try {
      return typeof content === 'string' ? JSON.parse(content) : content
    } catch {
      return {
        url: content,
        caption: metadata?.caption || '',
        alignment: metadata?.alignment || 'center'
      }
    }
  }

  const UploadButton = () => (
    <div className="text-center">
      <input
        type="file"
        id={`audio-upload-${id}`}
        className="hidden"
        accept="audio/*"
        onChange={handleFileUpload}
      />
      <div className="flex flex-col items-center gap-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-auto py-6 px-8 hover:bg-accent flex flex-col items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            document.getElementById(`audio-upload-${id}`)?.click()
          }}
        >
          <Music className="h-8 w-8 text-muted-foreground" />
          <span className="font-medium">Upload Audio</span>
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

  const audioContent = parseAudioContent(content)
  const alignment = audioContent.alignment || metadata?.alignment || 'center'

  return (
    <figure 
      className={cn(
        "my-4 relative group",
        "flex flex-col",
        alignment === 'left' && "items-start",
        alignment === 'center' && "items-center",
        alignment === 'right' && "items-end",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full max-w-[500px]">
        <div className="bg-muted rounded-lg p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Music className="h-6 w-6 text-primary" />
          </div>
          <audio 
            ref={audioRef}
            src={audioContent.url}
            controls
            className="w-full"
          />
        </div>
        {isEditing && isHovered && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 rounded-lg transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              id={`audio-change-${id}`}
              className="hidden"
              accept="audio/*"
              onChange={handleFileUpload}
            />
            <Button
              variant="secondary"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation()
                document.getElementById(`audio-change-${id}`)?.click()
              }}
            >
              <Music className="h-4 w-4" />
              Change Audio
            </Button>
            <Button
              variant="secondary"
              className="gap-2"
              onClick={handlePlayPause}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Play
                </>
              )}
            </Button>
          </div>
        )}
      </div>
      {audioContent.caption && (
        <figcaption className={cn(
          "mt-2 text-sm text-muted-foreground italic",
          alignment === 'left' && "text-left",
          alignment === 'center' && "text-center",
          alignment === 'right' && "text-right",
          metadata?.styles?.bold && "font-bold",
          metadata?.styles?.italic && "italic",
          metadata?.styles?.underline && "underline"
        )}>
          {audioContent.caption}
        </figcaption>
      )}
    </figure>
  )
}
