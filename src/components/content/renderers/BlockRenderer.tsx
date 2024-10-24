"use client"
import { Block } from '@/types/Block'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { Image } from '../blocks/Image'
import styled from 'styled-components'

const BlockContainer = styled.div`
  max-width: 740px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  line-height: 1.6;
`

const Paragraph = styled.p`
  margin-bottom: 1.5em;
`

const Heading = styled.h1`
  font-weight: 700;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  text-align: center; // Add this line to center the heading
`

const CodeBlock = styled(SyntaxHighlighter)`
  border-radius: 4px;
  margin-bottom: 1.5em;
`

const List = styled.ul`
  margin-bottom: 1.5em;
  padding-left: 2em;
`

const Blockquote = styled.blockquote`
  border-left: 4px solid #ddd;
  padding-left: 1em;
  margin-left: 0;
  font-style: italic;
  color: #555;
`

const MainTitle = styled(Heading)`
  text-align: center;
  font-size: 2.5em;
  color: #333;
  margin-bottom: 0.3em;
`

interface BlockRendererProps {
  block: Block
}

export function BlockRenderer({ block }: BlockRendererProps) {
  const renderBlock = (block: Block) => {
    switch (block.type) {
      case 'paragraph':
        return <Paragraph>{block.content}</Paragraph>
      case 'heading':
        const HeadingTag = `h${block.metadata?.level || 1}` as keyof JSX.IntrinsicElements
        if (block.metadata?.level === 1) {
          return <MainTitle as={HeadingTag}>{block.content}</MainTitle>
        }
        return <Heading as={HeadingTag}>{block.content}</Heading>
      case 'code':
        return (
          <CodeBlock
            language={block.metadata?.language || 'text'}
            style={dark}
          >
            {block.content}
          </CodeBlock>
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
        const ListTag = block.metadata?.listType === 'ordered' ? 'ol' : 'ul'
        return (
          <List as={ListTag}>
            {block.content.split('\n').map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </List>
        )
      case 'blockquote':
        return <Blockquote>{block.content}</Blockquote>
      case 'divider':
        return <hr />
      default:
        return null
    }
  }

  return <BlockContainer>{renderBlock(block)}</BlockContainer>
}
