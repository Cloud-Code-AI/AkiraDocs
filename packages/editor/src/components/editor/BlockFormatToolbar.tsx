import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface BlockFormatToolbarProps {
  styles?: {
    bold?: boolean
    italic?: boolean
    underline?: boolean
  }
  align?: 'left' | 'center' | 'right'
  onStyleChange: (styles: { bold?: boolean; italic?: boolean; underline?: boolean }) => void
  onAlignChange: (align: 'left' | 'center' | 'right') => void
  className?: string
}

export function BlockFormatToolbar({ 
  styles = {
    bold: false,
    italic: false,
    underline: false
  }, 
  align = 'left',
  onStyleChange,
  onAlignChange,
  className
}: BlockFormatToolbarProps) {
  return (
    <div className={cn(
      "absolute -top-10 left-1/2 -translate-x-1/2 z-50",
      "opacity-0 group-hover:opacity-100 transition-opacity",
      "flex items-center gap-1 p-1",
      "bg-popover border shadow-md rounded-md",
      className
    )}>
      <ToggleGroup type="multiple" value={Object.entries(styles).filter(([_, value]) => value).map(([key]) => key)} className="flex gap-0.5">
        <ToggleGroupItem
          value="bold"
          aria-pressed={styles.bold}
          onClick={() => onStyleChange({ ...styles, bold: !styles.bold })}
          size="sm"
          className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        >
          <Bold className="h-3.5 w-3.5" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="italic"
          aria-pressed={styles.italic}
          onClick={() => onStyleChange({ ...styles, italic: !styles.italic })}
          size="sm"
          className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        >
          <Italic className="h-3.5 w-3.5" />
        </ToggleGroupItem>
        <ToggleGroupItem
          value="underline"
          aria-pressed={styles.underline}
          onClick={() => onStyleChange({ ...styles, underline: !styles.underline })}
          size="sm"
          className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
        >
          <Underline className="h-3.5 w-3.5" />
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator orientation="vertical" className="mx-0.5 h-7" />

      <ToggleGroup 
        type="single" 
        value={align} 
        onValueChange={(value) => value && onAlignChange(value as 'left' | 'center' | 'right')}
        className="flex gap-0.5"
      >
        <ToggleGroupItem value="left" size="sm" className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
          <AlignLeft className="h-3.5 w-3.5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" size="sm" className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
          <AlignCenter className="h-3.5 w-3.5" />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" size="sm" className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
          <AlignRight className="h-3.5 w-3.5" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  )
}