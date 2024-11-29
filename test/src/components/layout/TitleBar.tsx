'use client'

import { ArrowLeft, Save } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from 'next/navigation'

interface TitleBarProps {
  onSave: () => void
  isSaving?: boolean
}

export function TitleBar({ onSave, isSaving = false }: TitleBarProps) {
  const pathname = usePathname()
  
  // Extract filename from URL, remove .json extension, and capitalize
  const filename = pathname
    ?.split('/')
    .pop()
    ?.replace('.json', '')
    ?.split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ') || 'Untitled'

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-3">
        <Link href="/editor">
          <Button variant="ghost" size="icon" className="hover:bg-accent">
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">Back to editor</span>
          </Button>
        </Link>
        <h1 className="text-lg font-medium">{filename}</h1>
      </div>
      
      <Button 
        onClick={onSave}
        disabled={isSaving}
        className="flex items-center space-x-2"
      >
        <Save className="w-4 h-4" />
        <span>{isSaving ? 'Saving...' : 'Save'}</span>
      </Button>
    </div>
  )
}
