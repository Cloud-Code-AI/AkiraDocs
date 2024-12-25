import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Wand2 } from 'lucide-react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { ListIcon, ListOrdered } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { BlockType } from '@/types/Block'
import { AIRewriteButton } from '@/components/editor/AIRewriteButton'

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
  listType?: 'ordered' | 'unordered'
  onListTypeChange?: (listType: 'ordered' | 'unordered') => void
  showListControls?: boolean
  language?: string
  filename?: string
  showLineNumbers?: boolean
  onLanguageChange?: (language: string) => void
  onFilenameChange?: (filename: string) => void
  onShowLineNumbersChange?: (show: boolean) => void
  showCodeControls?: boolean;
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
  isVisible?: boolean;
  onAiRewrite?: (style: string) => Promise<void>
  isAiRewriting?: boolean
  blockType?: BlockType
  showVideoControls?: boolean;
  videoContent?: {
    url: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
    size?: 'small' | 'medium' | 'large' | 'full';
  };
  onVideoMetadataChange?: (metadata: Partial<{
    caption: string;
    alignment: 'left' | 'center' | 'right';
    size: 'small' | 'medium' | 'large' | 'full';
  }>) => void;
  showAudioControls?: boolean;
  audioContent?: {
    url: string;
    caption?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  onAudioMetadataChange?: (metadata: Partial<{
    caption: string;
    alignment: 'left' | 'center' | 'right';
  }>) => void;
  showButtonControls?: boolean;
  buttonMetadata?: {
    url?: string;
    style?: {
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
      size?: 'default' | 'sm' | 'lg';   
      radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    };
  };
  onButtonMetadataChange?: (metadata: Partial<{
    buttonUrl: string;
    buttonStyle: {
      variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
      size?: 'default' | 'sm' | 'lg';
      radius?: 'none' | 'sm' | 'md' | 'lg' | 'full';
    };
  }>) => void;
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
  listType = 'unordered',
  onListTypeChange,
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
  isVisible = false,
  onAiRewrite,
  isAiRewriting,
  blockType,
  showVideoControls = false,
  videoContent,
  onVideoMetadataChange,
  showAudioControls = false,
  audioContent,
  onAudioMetadataChange,
  showButtonControls = false,
  buttonMetadata,
  onButtonMetadataChange,
}: BlockFormatToolbarProps) {
  if (blockType === 'file' || blockType === 'spacer') {
    return null;
  }

  return (
    <div className={cn(
      "absolute -top-10 left-1/2 -translate-x-1/2 z-50",
      isVisible ? "opacity-100" : "opacity-0",
      "transition-opacity",
      "flex items-center gap-1 p-1",
      "bg-popover border shadow-md rounded-md",
      className
    )}>
      {!showImageControls && !showCodeControls && !showVideoControls && !showAudioControls && !showButtonControls && blockType !== 'table' && (
        <>
          <ToggleGroup 
            type="multiple" 
            value={Object.entries(styles || {}).filter(([_, value]) => value).map(([key]) => key)} 
            onValueChange={(values) => {
              onStyleChange({
                bold: values.includes('bold'),
                italic: values.includes('italic'),
                underline: values.includes('underline')
              })
            }}
            className="flex gap-0.5"
          >
            {blockType !== 'heading' && (
              <ToggleGroupItem value="bold" size="sm" className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
                <Bold className="h-3.5 w-3.5" />
              </ToggleGroupItem>
            )}
            <ToggleGroupItem value="italic" size="sm" className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
              <Italic className="h-3.5 w-3.5" />
            </ToggleGroupItem>
            <ToggleGroupItem value="underline" size="sm" className="h-7 w-7 data-[state=on]:bg-accent data-[state=on]:text-accent-foreground">
              <Underline className="h-3.5 w-3.5" />
            </ToggleGroupItem>
          </ToggleGroup>
          {blockType !== 'blockquote' && blockType !== 'list' && blockType !== 'checkList' && <Separator orientation="vertical" className="mx-0.5 h-7" />}
        </>
      )}

      {!showCodeControls && !showCalloutControls && blockType !== 'blockquote' && blockType !== 'list' && blockType !== 'checkList' && blockType !== 'table' && (
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
      )}

      {showCodeControls && (
        <>
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

      {showListControls && onListTypeChange && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
          
          <ToggleGroup 
            type="single" 
            value={listType} 
            onValueChange={(value) => onListTypeChange?.(value as 'ordered' | 'unordered')}
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

      {showVideoControls && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
          
          <Input
            value={videoContent?.caption || ''}
            onChange={(e) => onVideoMetadataChange?.({ caption: e.target.value })}
            placeholder="Caption"
            className="h-7 w-32 text-xs"
          />
          
          <Select 
            value={videoContent?.size || 'medium'}
            onValueChange={(value) => onVideoMetadataChange?.({ 
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

      {showAudioControls && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
          
          <Input
            value={audioContent?.caption || ''}
            onChange={(e) => onAudioMetadataChange?.({ caption: e.target.value })}
            placeholder="Caption"
            className="h-7 w-32 text-xs"
          />
        </>
      )}

      {showButtonControls && (
        <>
          <Separator orientation="vertical" className="mx-0.5 h-7" />
          
          <Input
            value={buttonMetadata?.url || ''}
            onChange={(e) => onButtonMetadataChange?.({ buttonUrl: e.target.value })}
            placeholder="URL"
            className="h-7 w-32 text-xs"
          />
          
          <Select 
            value={buttonMetadata?.style?.variant || 'default'}
            onValueChange={(value) => onButtonMetadataChange?.({ 
              buttonStyle: { 
                ...buttonMetadata?.style,
                variant: value as any
              } 
            })}
          >
            <SelectTrigger className="h-7 w-24">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="destructive">Destructive</SelectItem>
              <SelectItem value="outline">Outline</SelectItem>
              <SelectItem value="secondary">Secondary</SelectItem>
              <SelectItem value="ghost">Ghost</SelectItem>
              <SelectItem value="link">Link</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={buttonMetadata?.style?.size || 'default'}
            onValueChange={(value) => onButtonMetadataChange?.({ 
              buttonStyle: { 
                ...buttonMetadata?.style,
                size: value as any
              } 
            })}
          >
            <SelectTrigger className="h-7 w-20">
              <SelectValue placeholder="Size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>

          <Select 
            value={buttonMetadata?.style?.radius || 'md'}
            onValueChange={(value) => onButtonMetadataChange?.({ 
              buttonStyle: { 
                ...buttonMetadata?.style,
                radius: value as any
              } 
            })}
          >
            <SelectTrigger className="h-7 w-20">
              <SelectValue placeholder="Radius" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Square</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
              <SelectItem value="full">Pill</SelectItem>
            </SelectContent>
          </Select>
        </>
      )}

      {!showImageControls && !showVideoControls && !showAudioControls && (
        <>
          {!showCalloutControls && blockType !== 'table' && <Separator orientation="vertical" className="mx-0.5 h-7" />}
          <div className="ml-auto">
            <AIRewriteButton
              blockType={blockType || 'paragraph'}
              onRewrite={onAiRewrite || (async () => {})}
              isRewriting={isAiRewriting}
            />
          </div>
        </>
      )}
    </div>
  );
}