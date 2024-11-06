import { useEffect, useState } from 'react'
import { BlogPost } from '../../types/BlogPost'
import { MarkdownRenderer } from '../renderers/MarkdownRenderer'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff } from 'lucide-react'
import matter from 'gray-matter'

interface MarkdownEditorProps {
  content: BlogPost
  onChange: (content: BlogPost) => void
}

export function MarkdownEditor({ content, onChange }: MarkdownEditorProps) {
  const [markdownContent, setMarkdownContent] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    // Convert BlogPost to markdown format
    const frontmatter = {
      title: content.title,
      description: content.description,
      author: content.author,
      publishDate: content.publishDate,
      modifiedDate: content.modifiedDate,
      category: content.category,
      keywords: content.keywords,
    }

    const markdown = content.blocks.map(block => {
      switch (block.type) {
        case 'heading':
          return `${'#'.repeat(block.metadata?.level || 1)} ${block.content}\n\n`
        case 'code':
          return `\`\`\`${block.metadata?.language || ''}\n${block.content}\n\`\`\`\n\n`
        case 'image':
          return `![${block.metadata?.alt || ''}](${block.content} "${block.metadata?.caption || ''}")\n\n`
        case 'list':
          return block.content.split('\n').map(item => `* ${item}`).join('\n') + '\n\n'
        default:
          return `${block.content}\n\n`
      }
    }).join('')

    setMarkdownContent(matter.stringify(markdown, frontmatter))
  }, [content])

  const handleMarkdownChange = (newContent: string) => {
    setMarkdownContent(newContent)
    const { data, content: mdContent } = matter(newContent)
    onChange({
      ...content,
      ...data,
      blocks: [
        {
          id: '1',
          type: 'markdown',
          content: mdContent,
          metadata: {}
        }
      ]
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowPreview(!showPreview)}
        >
          {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          <span className="ml-2">{showPreview ? 'Hide Preview' : 'Show Preview'}</span>
        </Button>
      </div>

      <div className="grid gap-4" style={{ gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr' }}>
        <Textarea
          value={markdownContent}
          onChange={(e) => handleMarkdownChange(e.target.value)}
          className="min-h-[500px] font-mono"
          placeholder="Write your content in markdown..."
        />
        {showPreview && (
          <div className="prose prose-invert max-w-none">
            <MarkdownRenderer content={markdownContent} />
          </div>
        )}
      </div>
    </div>
  )
} 