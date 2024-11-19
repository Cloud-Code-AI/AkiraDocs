import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ListIcon, ListOrdered } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
  level?: number
  onLevelChange?: (level: number) => void
  showLevelSelect?: boolean
  ordered?: boolean
  onOrderedChange?: (ordered: boolean) => void
  showListControls?: boolean
  language?: string
  filename?: string
  showLineNumbers?: boolean
  onLanguageChange?: (language: string) => void
  onFilenameChange?: (filename: string) => void
  onShowLineNumbersChange?: (show: boolean) => void
  showCodeControls?: boolean
  showImageControls?: boolean;
  imageContent?: {
    url: string;
    alt?: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large' | 'full';
  };
  onImageMetadataChange?: (metadata: Partial<{
    alt: string;
    caption: string;
    alignment: 'left' | 'center' | 'right';
    size: 'small' | 'medium' | 'large' | 'full';
  }>) => void;
  showCalloutControls?: boolean;
  calloutType?: 'info' | 'warning' | 'success' | 'error';
  calloutTitle?: string;
  onCalloutTypeChange?: (type: 'info' | 'warning' | 'success' | 'error') => void;
  onCalloutTitleChange?: (title: string) => void;
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
  className,
  level = 1,
  onLevelChange,
  showLevelSelect = false,
  ordered = false,
  onOrderedChange,
  showListControls = false,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  onLanguageChange,
  onFilenameChange,
  onShowLineNumbersChange,
  showCodeControls = false,
  showImageControls = false,
  imageContent,
  onImageMetadataChange,
  showCalloutControls = false,
  calloutType = 'info',
  calloutTitle = '',
  onCalloutTypeChange,
  onCalloutTitleChange,
}: BlockFormatToolbarProps) {
  return (
    <div className={cn(
      "absolute -top-10 left-1/2 -translate-x-1/2 z-50",
      "opacity-0 group-hover:opacity-100 transition-opacity",
      "flex items-center gap-1 p-1",
      "bg-popover border shadow-md rounded-md",
      className
    )}>
      {!showImageControls && (
        <>
          <ToggleGroup type="multiple" value={Object.entries(styles).filter(([_, value]) => value).map(([key]) => key)} className="flex gap-0.5">
            <ToggleGroupItem value="bold" size="sm" className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
              <Bold className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="italic" size="sm" className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
              <Italic className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" size="sm" className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
              <Underline className="h-3.5 w-3.5" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
        </>
      )}

      <ToggleGroup type="single" value={align} onValueChange={(value) => value && onAlignChange(value as 'left' | 'center' | 'right')} className="flex gap-0.5">
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

      {showCodeControls && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
          
          <Input
            value={language}
            onChange={(e) => onLanguageChange?.(e.target.value)}
            placeholder="Language"
            className="h-7 w-24 text-xs"
          />
          
          <Input
            value={filename || ''}
            onChange={(e) => onFilenameChange?.(e.target.value)}
            placeholder="Filename"
            className="h-7 w-32 text-xs"
          />
          
          <ToggleGroup type="single" value={showLineNumbers ? 'show' : 'hide'} onValueChange={(value) => onShowLineNumbersChange?.(value === 'show')} className="flex gap-0.5">
            <ToggleGroupItem
              value="show"
              size="sm"
              className="h-7 px-2 text-xs data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </ToggleGroupItem>
          </ToggleGroup>
        </>
      )}

      {showLevelSelect && onLevelChange && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
          
          <Select value={level.toString()} onValueChange={(value) => onLevelChange(parseInt(value))}>
            <SelectTrigger className="h-7 w-16">
              <SelectValue placeholder="H1" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((level) => (
                <SelectItem key={level} value={level.toString()}>
                  H{level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </>
      )}

      {showListControls && onOrderedChange && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
          
          <ToggleGroup 
            type="single" 
            value={ordered ? 'ordered' : 'unordered'} 
            onValueChange={(value) => onOrderedChange(value === 'ordered')}
            className="flex gap-0.5"
          >
            <ToggleGroupItem 
              value="unordered" 
              size="sm" 
              className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            >
              <ListIcon className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem 
              value="ordered" 
              size="sm" 
              className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground"
            >
              <ListOrdered className="h-3.5 w-3.5" />
            </ToggleGroupItem>
          </ToggleGroup>
        </>
      )}

      {showImageControls && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
          
          <Input
            value={imageContent?.alt || ''}
            onChange={(e) => onImageMetadataChange?.({ alt: e.target.value })}
            placeholder="Alt text"
            className="h-7 w-24 text-xs"
          />
          
          <Input
            value={imageContent?.caption || ''}
            onChange={(e) => onImageMetadataChange?.({ caption: e.target.value })}
            placeholder="Caption"
            className="h-7 w-32 text-xs"
          />
          
          <Select 
            value={imageContent?.size || 'medium'}
            onValueChange={(value) => onImageMetadataChange?.({ 
              size: value as 'small' | 'medium' | 'large' | 'full' 
            })}
          >
            <SelectTrigger className="h-7 w-20">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Small</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="large">Large</SelectItem>
              <SelectItem value="full">Full width</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {showCalloutControls && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
          
          <Select 
            value={calloutType} 
            onValueChange={(value) => onCalloutTypeChange?.(value as 'info' | 'warning' | 'success' | 'error')}
          >
            <SelectTrigger className="h-7 w-24">
              <SelectValue placeholder="Type"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>

          <Input
            value={calloutTitle}
            onChange={(e) => onCalloutTitleChange?.(e.target.value)}
            placeholder="Title"
            className="h-7 w-32 text-xs"
          />
        </>
      )}
    </div>
  );
}