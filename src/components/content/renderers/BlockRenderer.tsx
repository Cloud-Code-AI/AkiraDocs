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

interface BlockRendererProps {
  block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'paragraph':
        return <Paragraph>{block.content}</Paragraph>
      case 'heading':
        const level = block.metadata?.level || 1
        return level === 1 ? (
          <MainTitle>{block.content}</MainTitle>
        ) : (
          <Heading level={level}>{block.content}</Heading>
        )
      case 'code':
        return (
          <CodeBlock
            code={block.content}
            language={block.metadata?.language || 'text'}
            filename={block.metadata?.filename}
            showLineNumbers={block.metadata?.showLineNumbers}
          />
        )
      case 'image':
        return (
          <Image
            src={block.content}
            alt={block.metadata?.alt || ''}
            caption={block.metadata?.caption}
            size={block.metadata?.size}
            position={block.metadata?.position}
          />
        )
      case 'list':
        return (
          <List
            items={block.content.split('\n')}
            ordered={block.metadata?.listType === 'ordered'}
          />
        )
      case 'blockquote':
        return <Blockquote>{block.content}</Blockquote>
      case 'divider':
        return <Divider />
      case 'table':
        return <Table headers={block.metadata?.headers || []} rows={block.metadata?.rows || []} />
      case 'toggleList':
        return <ToggleList items={block.metadata?.items || []} />
      case 'checkList':
        return <CheckList items={block.metadata?.checkedItems || []} />
      case 'video':
        return <Video src={block.content} caption={block.metadata?.caption} />
      case 'audio':
        return <Audio src={block.content} caption={block.metadata?.caption} />
      case 'file':
        return <File url={block.content} name={block.metadata?.name || 'Download'} />
      case 'emoji':
        return <Emoji symbol={block.content} label={block.metadata?.label} />
      default:
        return null
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-5 font-sans">
      {renderBlock(block)}
    </div>
  )
}
