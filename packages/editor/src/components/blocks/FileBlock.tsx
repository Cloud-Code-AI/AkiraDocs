"use client"

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  FilePlus, 
  FileText, 
  FileImage, 
  FileVideo, 
  FileAudio, 
  FileCode, 
  FileArchive,
  File as FileIcon
} from 'lucide-react'
import { useState } from 'react'
import { saveFileToPublic } from '@/lib/fileUtils'

interface FileBlockProps {
  content: string
  id: string
  onUpdate?: (content: string) => void
  isEditing?: boolean
  metadata?: {
    name?: string
    fileType?: string
  }
}

// Helper function to get appropriate icon based on file type
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) return FileImage
  if (fileType.startsWith('video/')) return FileVideo
  if (fileType.startsWith('audio/')) return FileAudio
  if (fileType.startsWith('text/')) return FileText
  if (fileType.includes('pdf')) return FileText
  if (fileType.includes('word')) return FileText
  if (fileType.includes('excel')) return FileText
  if (fileType.includes('powerpoint')) return FileText
  if (fileType.includes('code') || fileType.includes('javascript') || fileType.includes('json')) return FileCode
  if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return FileArchive
  return FileIcon
}

// Helper function to format file size
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Helper function to format file type display
const formatFileType = (fileType: string) => {
  return fileType
    .replace('application/', '')
    .replace('text/', '')
    .toUpperCase()
}

export function FileBlock({ content, id, onUpdate, isEditing, metadata }: FileBlockProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const filename = await saveFileToPublic(file)
      
      const fileContent = JSON.stringify({
        url: `/${filename}`,
        name: file.name,
        fileType: file.type,
        size: file.size
      })

      onUpdate?.(fileContent)
    } catch (error) {
      console.error('Failed to upload file:', error)
    }
  }

  const parseFileContent = (content: string) => {
    try {
      return typeof content === 'string' ? JSON.parse(content) : content
    } catch {
      return {
        url: content,
        name: metadata?.name || '',
        fileType: metadata?.fileType || '',
        size: 0
      }
    }
  }

  const UploadButton = () => (
    <div className="text-center">
      <input
        type="file"
        id={`file-upload-${id}`}
        className="hidden"
        onChange={handleFileUpload}
      />
      <div className="flex flex-col items-center gap-2">
        <Button
          variant="ghost"
          className="w-full justify-start h-auto py-6 px-8 hover:bg-accent flex flex-col items-center gap-2"
          onClick={(e) => {
            e.stopPropagation()
            document.getElementById(`file-upload-${id}`)?.click()
          }}
        >
          <FilePlus className="h-8 w-8 text-muted-foreground" />
          <span className="font-medium">Upload File</span>
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

  const fileContent = parseFileContent(content)
  const FileTypeIcon = getFileIcon(fileContent.fileType)

  return (
    <div 
      className={cn(
        "my-4 relative group"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative flex items-center p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors">
        <div className="mr-4">
          <FileTypeIcon className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <a 
              href={fileContent.url} 
              download 
              className="text-primary hover:text-primary/80 hover:underline font-medium"
            >
              {fileContent.name}
            </a>
            {fileContent.size > 0 && (
              <span className="text-sm text-muted-foreground">
                {formatFileSize(fileContent.size)}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {formatFileType(fileContent.fileType)}
          </p>
        </div>
        
        {isEditing && isHovered && (
          <div className="ml-4">
            <input
              type="file"
              id={`file-change-${id}`}
              className="hidden"
              onChange={handleFileUpload}
            />
            <Button
              variant="default"
              size="sm"
              className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={(e) => {
                e.stopPropagation()
                document.getElementById(`file-change-${id}`)?.click()
              }}
            >
              <FilePlus className="h-4 w-4" />
              Change
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
