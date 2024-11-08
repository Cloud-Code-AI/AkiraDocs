'use client'

// import Link from 'next/link'
import { Save } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface TitleBarProps {
  showPreview: boolean
  setShowPreview: (show: boolean) => void
  onSave: () => void
  isSaving?: boolean
}

export function TitleBar({ showPreview, setShowPreview, onSave, isSaving = false }: TitleBarProps) {

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex space-x-2">
        <Button
          variant={showPreview ? "outline" : "default"}
          onClick={() => setShowPreview(false)}
        >
          Edit
        </Button>
        <Button
          variant={showPreview ? "default" : "outline"}
          onClick={() => setShowPreview(true)}
        >
          Preview
        </Button>
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
