'use client'

import { Input } from "@/components/ui/input"

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
        className="text-4xl font-bold mb-4 border-none px-0 max-w-4xl break-words"
      />
      <Input
        value={subtitle}
        onChange={(e) => setSubtitle(e.target.value)}
        placeholder="Add a subtitle"
        className="text-xl mb-4 border-none px-0 max-w-4xl break-words"
      />
    </>
  )
}