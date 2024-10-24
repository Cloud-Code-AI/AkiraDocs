import { Block } from '@/types/Block'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Image } from '../blocks/Image'

interface BlockRendererProps {
  block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
  switch (block.type) {
    case 'paragraph':
      return <p>{block.content}</p>
    case 'heading':
      const HeadingTag = `h${block.metadata?.level || 1}` as keyof JSX.IntrinsicElements
      return <HeadingTag>{block.content}</HeadingTag>
    case 'code':
      return (
        <SyntaxHighlighter
          language={block.metadata?.language || 'text'}
          style={dark}
        >
          {block.content}
        </SyntaxHighlighter>
      )
    case 'image':
      return (
        <Image
          src={block.content}
          alt={block.metadata?.alt || ''}
          caption={block.metadata?.caption}
        />
      )
    case 'list':
      const ListTag = block.metadata?.listType === 'ordered' ? 'ol' : 'ul'
      return (
        <ListTag>
          {block.content.split('\n').map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ListTag>
      )
    default:
      return null
  }
}