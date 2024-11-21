"use client"
import { Block } from '@/types/Block'
import { Paragraph } from "@/components/blocks/ParagraphBlock"
import { HeadingTitle } from "@/components/blocks/HeadingBlock"
import { List } from "@/components/blocks/ListBlock"
import { Blockquote } from "@/components/blocks/BlockquoteBlock"
import { Divider } from "@/components/blocks/DividerBlock"
import { CodeBlock } from "@/components/blocks/CodeBlock"
// import { Image } from '../blocks/Image'
// import { Table } from '../blocks/Table'
// import { ToggleList } from '../blocks/ToggleList'
// import { CheckList } from '../blocks/CheckList'
// import { Video } from '../blocks/Video'
// import { Audio } from '../blocks/Audio'
// import { File } from '../blocks/File'
// import { Emoji } from '../blocks/Emoji'
import { Callout } from "@/components/blocks/CalloutBlock"
import { cn } from '@/lib/utils'
import { ErrorBoundary } from 'react-error-boundary'

interface ImageBlockContent {
  url: string;
  alt?: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large' | 'full';
}

interface BlockRendererProps {
  block: Block
}

function BlockErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/10">
      <p className="text-sm text-red-600 dark:text-red-400">Failed to render block content</p>
    </div>
  )
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const commonProps = {
    align: block.metadata?.align,
    styles: block.metadata?.styles,
    id: block.id,
  };

  if (block.type === 'image') {
    try {
      const imageContent: ImageBlockContent = typeof block.content === 'string' 
        ? JSON.parse(block.content)
        : block.content;

      return (
        <figure className={cn(
          "my-4",
          imageContent.alignment === 'left' && "text-left",
          imageContent.alignment === 'center' && "text-center",
          imageContent.alignment === 'right' && "text-right",
        )}>
          <img 
            src={imageContent.url} 
            alt={imageContent.alt} 
            className={cn(
              "h-auto rounded-lg inline-block",
              imageContent.size === 'small' && "max-w-[300px]",
              imageContent.size === 'medium' && "max-w-[500px]",
              imageContent.size === 'large' && "max-w-[800px]",
              imageContent.size === 'full' && "max-w-full",
            )}
          />
          {imageContent.caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground italic">
              {imageContent.caption}
            </figcaption>
          )}
        </figure>
      )
    } catch {
      // Fallback for old format or invalid JSON
      return <img src={block.content as string} alt="" className="max-w-full h-auto my-4" />
    }
  }

  switch (block.type) {
    case 'paragraph':
      return <Paragraph {...commonProps}>{block.content}</Paragraph>;
    case 'heading':
      return <HeadingTitle level={block.metadata?.level || 1} {...commonProps}>{block.content}</HeadingTitle>;
    case 'list':
      return <List items={block.content.split('\n')} listType={block.metadata?.listType || 'unordered'} {...commonProps} />;
    case 'code':
      return <CodeBlock code={block.content} language={block.metadata?.language} filename={block.metadata?.filename} showLineNumbers={block.metadata?.showLineNumbers} {...commonProps} />;
    case 'blockquote':
      return <Blockquote {...commonProps}>{block.content}</Blockquote>;
    // case 'table':
    //   return <Table headers={block.metadata?.headers || []} rows={block.metadata?.rows || []} {...commonProps} />;
    // case 'toggleList':
    //   return <ToggleList items={block.metadata?.items || []} {...commonProps} />;
    // case 'checkList':
    //   return <CheckList items={block.metadata?.checkedItems || []} {...commonProps} />;
    // case 'video':
    //   return <Video src={block.content} caption={block.metadata?.caption} {...commonProps} />;
    // case 'audio':
    //   return <Audio src={block.content} caption={block.metadata?.caption} {...commonProps} />;
    // case 'file':
    //   return <File url={block.content} name={block.metadata?.name || ''} {...commonProps} />;
    // case 'emoji':
    //   return <Emoji symbol={block.content} label={block.metadata?.label} {...commonProps} />;
    case 'callout':
      return <Callout type={block.metadata?.type || 'info'} title={block.metadata?.title} {...commonProps}>{block.content}</Callout>;
    case 'divider':
      return <Divider align={block.metadata?.align} />;
    default:
      return null
  }
}
