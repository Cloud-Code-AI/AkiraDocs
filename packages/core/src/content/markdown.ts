import matter from 'gray-matter'
import { remark } from 'remark'
import { visit } from 'unist-util-visit'
import { BlogPost, Block } from '@/types/Block'
import type { ListItem } from 'mdast'

export function parseMarkdown(fileContent: string): BlogPost {
  // Parse frontmatter
  const { data, content } = matter(fileContent)
  
  // Convert markdown content to blocks
  const blocks: Block[] = []
  // let currentBlock: Block | null = null
  
  const ast = remark().parse(content)
  
  visit(ast, (node) => {
    switch (node.type) {
      case 'heading':
        blocks.push({
          id: Date.now().toString() + blocks.length,
          type: 'heading',
          content: node.children?.[0]?.type === 'text' ? node.children[0].value : '',
          metadata: { level: node.depth }
        })
        break
        
      case 'paragraph':
        blocks.push({
          id: Date.now().toString() + blocks.length,
          type: 'paragraph',
          content: node.children?.[0]?.type === 'text' ? node.children[0].value : ''
        })
        break
        
      case 'code':
        blocks.push({
          id: Date.now().toString() + blocks.length,
          type: 'code',
          content: node.value || '',
          metadata: {
            language: node.lang || undefined,
            filename: node.meta || undefined,
            showLineNumbers: true
          }
        })
        break
        
      case 'list':
        blocks.push({
          id: Date.now().toString() + blocks.length,
          type: 'list',
          content: node.children
            ?.map((child: ListItem) => 
              child.children?.[0]?.type === 'paragraph' 
                ? child.children[0].children?.[0]?.type === 'text'
                  ? child.children[0].children[0].value
                  : ''
                : ''
            )
            .join('\n') || '',
          metadata: { listType: node.ordered ? 'ordered' : 'unordered' }
        })
        break
        
      case 'image':
        blocks.push({
          id: Date.now().toString() + blocks.length,
          type: 'image',
          content: node.url || '',
          metadata: {
            alt: node.alt || undefined,
            caption: node.title || undefined
          }
        })
        break
    }
  })
  
  return {
    id: data.id || '',
    title: data.title || '',
    description: data.description || '',
    author: data.author || 'Anonymous',
    publishDate: data.publishDate || new Date().toISOString().split('T')[0],
    modifiedDate: data.modifiedDate || new Date().toISOString().split('T')[0],
    category: data.category || '',
    keywords: data.keywords || [],
    filename: data.filename || '',
    blocks
  }
} 