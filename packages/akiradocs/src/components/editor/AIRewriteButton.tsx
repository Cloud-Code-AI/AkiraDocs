import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Wand2 } from 'lucide-react'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BlockType } from '@/types/Block'
import { toast } from 'sonner'

const blockStyles = {
  article: [
    {
      value: 'professional',
      label: 'Professional',
      prompt: 'Rewrite this article title and subtitle to be clear and professional. Format as JSON with title and subtitle fields.'
    },
    {
      value: 'engaging',
      label: 'Engaging',
      prompt: 'Rewrite this article title and subtitle to be more engaging and attention-grabbing. Format as JSON with title and subtitle fields.'
    }
  ],

  heading: [
    {
      value: 'concise',
      label: 'Concise',
      prompt: 'Rewrite this heading to be clear and impactful in 2-6 words. Output only the heading text.'
    },
    {
      value: 'descriptive',
      label: 'Descriptive',
      prompt: 'Rewrite this heading to be more descriptive while maintaining clarity. Keep under 10 words. Output only the heading text.'
    }
  ],

  paragraph: [
    {
      value: 'professional',
      label: 'Professional',
      prompt: 'Rewrite this paragraph in a clear, professional tone. Keep it concise and direct. Output only the paragraph text.'
    },
    {
      value: 'casual',
      label: 'Casual',
      prompt: 'Rewrite this paragraph in a friendly, conversational tone. Make it engaging but clear. Output only the paragraph text.'
    }
  ],

  blockquote: [
    {
      value: 'inspirational',
      label: 'Inspirational',
      prompt: 'Rewrite this quote to be more inspirational while keeping its core message. Output only the quote text without any formatting or quotation marks.'
    },
    {
      value: 'powerful',
      label: 'Powerful',
      prompt: 'Rewrite this quote to be more impactful and memorable. Output only the quote text without any formatting or quotation marks.'
    }
  ],

  list: [
    {
      value: 'structured',
      label: 'Structured',
      prompt: 'Reorganize this list to be more structured and clear. Each item should be concise. Output only list items, one per line without bullets or numbers.'
    },
    {
      value: 'detailed',
      label: 'Detailed',
      prompt: 'Expand each list item with more detail while keeping clarity. Output only list items, one per line without bullets or numbers.'
    }
  ],

  code: [
    {
      value: 'optimize',
      label: 'Optimize',
      prompt: 'Optimize this code for better performance and readability. Keep the exact same language and functionality. Do not change imports or dependencies. Output only the optimized code.'
    },
    {
      value: 'document',
      label: 'Document',
      prompt: 'Add clear comments explaining the code functionality. Keep the exact same code and language. Only add or modify comments. Output only the documented code.'
    }
  ],

  image: [
    {
      value: 'descriptive',
      label: 'Descriptive',
      prompt: 'Rewrite only the alt text and caption to be more descriptive. Keep the image URL and other properties unchanged. Format as JSON with only alt and caption fields.'
    },
    {
      value: 'concise',
      label: 'Concise',
      prompt: 'Rewrite only the alt text and caption to be clear and concise. Keep the image URL and other properties unchanged. Format as JSON with only alt and caption fields.'
    }
  ],

  callout: [
    {
      value: 'clear',
      label: 'Clear',
      prompt: 'Rewrite this callout to be clearer and more direct. Keep the callout type (info/warning/success/error) and title unchanged. Output only the callout content.'
    },
    {
      value: 'actionable',
      label: 'Actionable',
      prompt: 'Rewrite this callout with clear action items. Keep the callout type and title unchanged. Output only the callout content.'
    }
  ],

  divider: [
    {
      value: 'default',
      label: 'Default',
      prompt: 'No rewriting options available for divider'
    }
  ],

  toggle: [
    { 
      value: 'clear',
      label: 'Clear',
      prompt: 'Rewrite the toggle content to be clearer and more organized. Keep the toggle structure. Output only the toggle content.'
    },
    {
      value: 'detailed',
      label: 'Detailed',
      prompt: 'Expand the toggle content with more detailed explanations. Keep the toggle structure. Output only the toggle content.'
    }
  ],
  
  apiReference: [
    {
      value: 'default',
      label: 'Default',
      prompt: 'No rewriting options available for API reference'
    }
  ],
} as const;

interface AIRewriteButtonProps {
  onRewrite: (style: string) => Promise<void>
  blockType: BlockType
  isRewriting?: boolean
}

export function AIRewriteButton({ onRewrite, blockType, isRewriting }: AIRewriteButtonProps) {
  const [style, setStyle] = useState<string>(() => {
    const styles = blockStyles[blockType] || blockStyles['paragraph']
    return styles[0].value
  })

  const getBlockStyles = (blockType: BlockType) => {
    return blockStyles[blockType] || blockStyles['paragraph'];
  };

  const handleRewrite = async () => {
    try {
      await onRewrite(style)
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes('API key')) {
        toast.error(error.message)
      } else {
        toast.error('Failed to rewrite content')
      }
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-auto px-2 flex items-center gap-2 md:whitespace-nowrap"
        >
          <Wand2 className="h-4 w-4" />
          Rewrite with AI
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end">
        <div className="space-y-4">
          <h3 className="font-medium">Rewrite with AI</h3>
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger>
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {getBlockStyles(blockType).map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            className="w-full" 
            onClick={handleRewrite}
            disabled={isRewriting}
          >
            {isRewriting ? 'Rewriting...' : 'Rewrite'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
} 