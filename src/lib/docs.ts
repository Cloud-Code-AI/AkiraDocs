import { BlogPost } from '@/types/Block'

const docsContext = require.context('../../_content/docs', true, /\.json$/)

export function getDocBySlug(slug: string): BlogPost {
  const normalizedSlug = slug || 'index'
  
  try {
    if (normalizedSlug === 'index') {
      try {
        // First try to get index.json
        return docsContext('./index.json')
      } catch {
        // If index.json doesn't exist, get all docs and use the first one
        const docs = getAllDocs()
          .filter(doc => doc.id !== 'index') // Exclude index to avoid potential circular reference
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

        if (docs.length > 0) {
          return docs[0]
        }

        // If no docs found, return placeholder content
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
    }
    
    return docsContext(`./${normalizedSlug}.json`)
  } catch (error) {
    console.error(`Error reading file: ${slug}.json`, error)
    throw new Error(`Document not found: ${slug}`)
  }
}

export function getAllDocs(): BlogPost[] {
  return docsContext.keys()
    .filter(fileName => fileName !== './_meta.json')
    .map(fileName => {
      const slug = fileName.replace(/^\.\//, '').replace(/\.json$/, '')
      return getDocBySlug(slug)
    })
}
