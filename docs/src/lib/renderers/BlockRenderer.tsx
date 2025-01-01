"use client"
import { Block } from '@/types/Block'
import { Paragraph } from "@/components/blocks/ParagraphBlock"
import { HeadingTitle } from "@/components/blocks/HeadingBlock"
import { List } from "@/components/blocks/ListBlock"
import { Blockquote } from "@/components/blocks/BlockquoteBlock"
import { Divider } from "@/components/blocks/DividerBlock"
import { CodeBlock } from "@/components/blocks/CodeBlock"
import { CheckList } from "@/components/blocks/CheckListBlock"
import { Callout } from "@/components/blocks/CalloutBlock"
import { ImageBlock } from "@/components/blocks/ImageBlock"
import { Table } from '@/components/blocks/TableBlock'
import { VideoBlock } from "@/components/blocks/VideoBlock"
import { AudioBlock } from "@/components/blocks/AudioBlock"
import { FileBlock } from "@/components/blocks/FileBlock"
import { SpacerBlock } from "@/components/blocks/SpacerBlock"
import { ButtonBlock } from "@/components/blocks/ButtonBlock"

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
          {...commonProps}
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
          {...commonProps}
          content={Array.isArray(block.content) ? block.content.join('\n') : block.content}
          listType={block.metadata?.listType || 'unordered'} 
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
          {...commonProps}
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
          {...commonProps}
          content={block.content}
          id={block.id}
          metadata={block.metadata}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        />
      );
    case 'table':
      return (
        <Table
          headers={block.metadata?.headers || ['Column 1', 'Column 2']}
          rows={block.metadata?.rows || [['', '']]}
          isEditing={isEditing}
          onChange={(headers, rows) => {
            onUpdate?.(block.id, JSON.stringify({ headers, rows }));
          }}
          align={block.metadata?.align}
          styles={block.metadata?.styles}
        />
      );
    case 'callout':
      return (
        <Callout 
          {...commonProps}
          type={block.metadata?.type || 'info'} 
          title={block.metadata?.title} 
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        >
          {block.content}
        </Callout>
      );
    case 'divider':
      return <Divider {...commonProps} />;
    case 'video':
      const videoContent = (() => {
        try {
          return typeof block.content === 'string'
            ? JSON.parse(block.content)
            : block.content;
        } catch {
          return {
            url: block.content,
            caption: '',
            alignment: 'center',
            size: 'medium'
          };
        }
      })();
      
      return (
        <VideoBlock
          {...commonProps}
          content={block.content}
          id={block.id}
          metadata={{
            ...block.metadata,
            caption: videoContent.caption,
            alignment: videoContent.alignment,
            size: videoContent.size
          }}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        />
      );
    case 'audio':
      const audioContent = (() => {
        try {
          return typeof block.content === 'string'
            ? JSON.parse(block.content)
            : block.content;
        } catch {
          return {
            url: block.content,
            caption: '',
            alignment: 'center'
          };
        }
      })();
      
      return (
        <AudioBlock
          {...commonProps}
          content={block.content}
          id={block.id}
          metadata={{
            ...block.metadata,
            caption: audioContent.caption,
            alignment: audioContent.alignment
          }}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        />
      );
    case 'file':
      return (
        <FileBlock
          {...commonProps}
          content={block.content}
          id={block.id}
          metadata={block.metadata}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        />
      );
    case 'checkList':
      return (
        <CheckList
          {...commonProps}
          content={block.content}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
        />
      );
    case 'spacer':
      return (
        <SpacerBlock
          size={block.content as 'small' | 'medium' | 'large' | 'xlarge'}
          isEditing={isEditing}
          onUpdate={(size) => onUpdate?.(block.id, size)}
        />
      );
    case 'button':
      return (
        <ButtonBlock
          content={block.content}
          metadata={block.metadata}
          isEditing={isEditing}
          onUpdate={(content) => onUpdate?.(block.id, content)}
          align={block.metadata?.align}
        />
      );
    default:
      return null
  }
}
