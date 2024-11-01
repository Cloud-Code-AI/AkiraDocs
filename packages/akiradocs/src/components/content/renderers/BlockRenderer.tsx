"use client"
import React from 'react'
import { Block } from '@/types/Block'
import { Paragraph } from '../blocks/Paragraph'
import { Heading, MainTitle } from '../blocks/Heading'
import { List } from '../blocks/List'
import { Blockquote } from '../blocks/Blockquote'
import { Divider } from '../blocks/Divider'
import { CodeBlock } from '../blocks/CodeBlock'
import { Image } from '../blocks/Image'
import { Table } from '../blocks/Table'
import { ToggleList } from '../blocks/ToggleList'
import { CheckList } from '../blocks/CheckList'
import { Video } from '../blocks/Video'
import { Audio } from '../blocks/Audio'
import { File } from '../blocks/File'
import { Emoji } from '../blocks/Emoji'
import { Callout } from '../blocks/Callout'
import { cn } from '@/lib/utils'

interface ImageBlockContent {
  url: string;
  alt?: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
}

interface BlockRendererProps {
  block: Block
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
            className="max-w-full h-auto rounded-lg inline-block"
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
      return <Heading level={block.metadata?.level || 1} {...commonProps}>{block.content}</Heading>;
    case 'list':
      return <List items={block.content.split('\n')} ordered={block.metadata?.listType === 'ordered'} {...commonProps} />;
    case 'code':
      return <CodeBlock code={block.content} language={block.metadata?.language} filename={block.metadata?.filename} showLineNumbers={block.metadata?.showLineNumbers} {...commonProps} />;
    case 'image':
      return <Image src={block.content} alt={block.metadata?.alt || ''} caption={block.metadata?.caption} size={block.metadata?.size} position={block.metadata?.position} {...commonProps} />;
    case 'blockquote':
      return <Blockquote {...commonProps}>{block.content}</Blockquote>;
    case 'table':
      return <Table headers={block.metadata?.headers || []} rows={block.metadata?.rows || []} {...commonProps} />;
    case 'toggleList':
      return <ToggleList items={block.metadata?.items || []} {...commonProps} />;
    case 'checkList':
      return <CheckList items={block.metadata?.checkedItems || []} {...commonProps} />;
    case 'video':
      return <Video src={block.content} caption={block.metadata?.caption} {...commonProps} />;
    case 'audio':
      return <Audio src={block.content} caption={block.metadata?.caption} {...commonProps} />;
    case 'file':
      return <File url={block.content} name={block.metadata?.name || ''} {...commonProps} />;
    case 'emoji':
      return <Emoji symbol={block.content} label={block.metadata?.label} {...commonProps} />;
    case 'callout':
      return <Callout type={block.metadata?.type || 'info'} title={block.metadata?.title} {...commonProps}>{block.content}</Callout>;
    case 'divider':
      return <Divider align={block.metadata?.align} />;
    default:
      return null
  }
}
