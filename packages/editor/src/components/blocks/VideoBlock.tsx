"use client"

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { VideoIcon, Pause, Play } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'

interface VideoBlockProps {
  content: string
  id: string
  onUpdate?: (content: string) => void
  isEditing?: boolean
  metadata?: {
    caption?: string
    alignment?: 'left' | 'center' | 'right'
    size?: 'small' | 'medium' | 'large' | 'full'
  }
}

interface VideoBlockContent {
  url: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large' | 'full';
}

export function VideoBlock({ content, id, onUpdate, isEditing, metadata }: VideoBlockProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Add event listeners to sync the isPlaying state with video events
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const file = e.target.files?.[0]
    if (!file) return

    const url = URL.createObjectURL(file)
    
    const videoContent = JSON.stringify({
      url,
      caption: metadata?.caption,
      alignment: metadata?.alignment || 'center',
      size: metadata?.size || 'medium'
    })

    onUpdate?.(videoContent)
  }

  const parseVideoContent = (content: string) => {
    try {
      return typeof content === 'string' ? JSON.parse(content) : content
    } catch {
      return {
        url: content,
        caption: metadata?.caption || '',
        alignment: metadata?.alignment || 'center',
        size: metadata?.size || 'medium'
      }
    }
  }

  const getVideoContent = (content: string): VideoBlockContent => {
    try {
      return typeof content === 'string' 
        ? JSON.parse(content)
        : content;
    } catch {
      return {
        url: content,
        caption: '',
        alignment: 'center',
        size: 'medium'
      };
    }
  };

  const UploadButton = () => (
    <div className="text-center">
      <input
        type="file"
        id={`video-upload-${id}`}
        className="hidden"
        accept="video/*"
        onChange={handleFileUpload}
      />
      <div className="flex flex-col items-center gap-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-auto py-6 px-8 hover:bg-accent flex flex-col items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            document.getElementById(`video-upload-${id}`)?.click()
          }}
        >
          <VideoIcon className="h-8 w-8 text-muted-foreground" />
          <span className="font-medium">Upload Video</span>
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

  const videoContent = parseVideoContent(content)
  const alignment = videoContent.alignment || metadata?.alignment || 'center'

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
      <div className="relative">
        <video 
          ref={videoRef}
          src={videoContent.url}
          controls
          className={cn(
            "rounded-lg",
            videoContent.size === 'small' && "max-w-[300px]",
            videoContent.size === 'medium' && "max-w-[500px]",
            videoContent.size === 'large' && "max-w-[800px]",
            videoContent.size === 'full' && "max-w-full w-full",
          )}
        />
        {isEditing && isHovered && (
          <div 
            className="absolute inset-0 bg-black/50 flex items-center justify-center gap-2 rounded-lg transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="file"
              id={`video-change-${id}`}
              className="hidden"
              accept="video/*"
              onChange={handleFileUpload}
            />
            <Button
              variant="secondary"
              className="gap-2"
              onClick={(e) => {
                e.stopPropagation()
                document.getElementById(`video-change-${id}`)?.click()
              }}
            >
              <VideoIcon className="h-4 w-4" />
              Change Video
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
      {videoContent.caption && (
        <figcaption className={cn(
          "mt-2 text-sm text-muted-foreground italic",
          alignment === 'left' && "text-left",
          alignment === 'center' && "text-center",
          alignment === 'right' && "text-right",
        )}>
          {videoContent.caption}
        </figcaption>
      )}
    </figure>
  )
}
