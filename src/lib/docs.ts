import { BlogPost } from '@/types/Block'

const docsContext = require.context('../../_content/docs', true, /\.json$/)

export function getDocBySlug(slug: string): BlogPost {
  const normalizedSlug = slug || 'index'
  
  try {
    return docsContext(`./${normalizedSlug}.json`)
  } catch (error) {
    if (normalizedSlug === 'index') {
      return {
        id: 'index',
        title: 'Documentation',
        description: 'Our documentation is currently under construction.',
        author: 'System',
        date: new Date().toISOString(),
        blocks: [
          {
            id: '1',
            type: 'heading',
            content: 'Documentation',
            metadata: { level: 1 }
          },
          {
            id: '2',
            type: 'paragraph',
            content: 'Our documentation is currently under construction. Please check back later.'
          },
          {
            id: '3',
            type: 'paragraph',
            content: 'In the meantime, you can explore other sections of our site or contact our support team for assistance.'
          }
        ]
      }
    }
    console.error(`Error reading file: ${slug}.json`, error)
    throw new Error(`Document not found: ${slug}`)
  }
}

export function getAllDocs(): BlogPost[] {
  return docsContext.keys().map(fileName => {
    const slug = fileName.replace(/^\.\//, '').replace(/\.json$/, '')
    return getDocBySlug(slug)
  })
}
