import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Wand2 } from 'lucide-react'
import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { BlockType } from '@/types/Block'

interface AIRewriteButtonProps {
  onRewrite: (style: string) => Promise<void>
  blockType: BlockType
  isLoading?: boolean
}

export function AIRewriteButton({ onRewrite, blockType, isLoading }: AIRewriteButtonProps) {
  const [style, setStyle] = useState('professional')

  const styles = {
    paragraph: [
      { value: 'professional', label: 'Professional' },
      { value: 'casual', label: 'Casual' },
      { value: 'academic', label: 'Academic' },
      { value: 'creative', label: 'Creative' }
    ],
    heading: [
      { value: 'concise', label: 'Concise' },
      { value: 'descriptive', label: 'Descriptive' },
      { value: 'engaging', label: 'Engaging' }
    ],
    blockquote: [
      { value: 'inspirational', label: 'Inspirational' },
      { value: 'thoughtful', label: 'Thoughtful' },
      { value: 'powerful', label: 'Powerful' }
    ]
  }

  const blockStyles = styles[blockType as keyof typeof styles] || styles.paragraph

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Wand2 className="h-4 w-4" />
          <span className="sr-only">AI Rewrite</span>
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
              {blockStyles.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            className="w-full" 
            onClick={() => onRewrite(style)}
            disabled={isLoading}
          >
            {isLoading ? 'Rewriting...' : 'Rewrite'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
} 