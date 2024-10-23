'use client'

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Image } from 'lucide-react'

interface ArticleHeadersProps {
  title: string
  setTitle: (title: string) => void
  subtitle: string
  setSubtitle: (subtitle: string) => void
  showPreview: boolean
}

export function ArticleHeaders({ title, setTitle, subtitle, setSubtitle, showPreview }: ArticleHeadersProps) {
  if (showPreview) {
    return (
      <>
        <h1 className="text-4xl font-bold mb-2">{title}</h1>
        <h2 className="text-xl mb-4">{subtitle}</h2>
      </>
    )
  }

  return (
    <>
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article title"
        className="text-4xl font-bold mb-4 border-none px-0"
      />
      <Input
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="Add a subtitle"
        className="text-xl mb-4 border-none px-0"
      />
      {/* <Button variant="outline" className="mb-4">
        <Image className="w-4 h-4 mr-2" />
        Add featured image (1200x630px)
      </Button> */}
    </>
  )
}