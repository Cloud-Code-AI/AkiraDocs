'use client'

import Link from 'next/link'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'

interface TitleBarProps {
  showPreview: boolean
  setShowPreview: (show: boolean) => void
}

export function TitleBar({ showPreview, setShowPreview }: TitleBarProps) {
  const router = useRouter()

  return (
    <div className="flex items-center mb-6">
      <Button variant="ghost" onClick={() => router.back()} className="mr-4">
        <ArrowLeft className="w-6 h-6" />
      </Button>
      <h1 className="text-xl font-semibold">Draft article</h1>
      <Button 
        variant="ghost" 
        size="icon" 
        className="ml-auto"
        onClick={() => setShowPreview(!showPreview)}
      >
        {showPreview ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
      </Button>
    </div>
  )
}
