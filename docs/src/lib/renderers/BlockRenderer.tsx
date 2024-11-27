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
import { ImageBlock } from "@/components/blocks/ImageBlock"

interface ImageBlockContent {
  url: string;
  alt?: string;
  caption?: string;
  alignment?: 'left' | 'center' | 'right';
  size?: 'small' | 'medium' | 'large' | 'full';
}

interface BlockRendererProps {
  block: Block
  isEditing?: boolean
  onUpdate?: (id: string, content: string) => void
}

function BlockErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 border border-red-200 rounded-md bg-red-50 dark:bg-red-900/10">
      <p className="text-sm text-red-600 dark:text-red-400">Failed to render block content</p>
    </div>
  )
}

export function BlockRenderer({ block, isEditing, onUpdate }: BlockRendererProps) {
  const commonProps = {
    align: block.metadata?.align,
    styles: block.metadata?.styles,
    id: block.id,
  };

  switch (block.type) {
    case 'paragraph':
      return (
        <Paragraph 
          {...commonProps} 
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        >
          {block.content}
        </Paragraph>
      );
    case 'heading':
      return (
        <HeadingTitle
          level={block.metadata?.level || 1}
          align={block.metadata?.align}
          styles={block.metadata?.styles}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        >
          {block.content}
        </HeadingTitle>
      );
    case 'list':
      return (
        <List 
          content={typeof block.content === 'string' ? block.content : block.content.join('\n')}
          listType={block.metadata?.listType || 'unordered'} 
          {...commonProps}
          isEditing={isEditing}
          onUpdate={(content) => {
            // Ensure we're passing a plain string, not an array
            onUpdate?.(block.id, content);
          }}
        />
      );
    case 'code':
      return (
        <CodeBlock
          code={block.content}
          language={block.metadata?.language}
          filename={block.metadata?.filename}
          showLineNumbers={block.metadata?.showLineNumbers}
          align={block.metadata?.align}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        />
      );
    case 'blockquote':
      return (
        <Blockquote 
          {...commonProps}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        >
          {block.content}
        </Blockquote>
      );
    case 'image':
      return (
        <ImageBlock
          content={block.content}
          id={block.id}
          metadata={block.metadata}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        />
      );
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
      return (
        <Callout 
          type={block.metadata?.type || 'info'} 
          title={block.metadata?.title} 
          {...commonProps}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        >
          {block.content}
        </Callout>
      );
    case 'divider':
      return <Divider align={block.metadata?.align} />;
    default:
      return null
  }
}
