import { BlogPost } from '@/types/Block'

const articlesContext = require.context('../../_content/articles', true, /\.json$/)

export function getArticleBySlug(slug: string): BlogPost {
  const normalizedSlug = slug || ''
  
  try {
    if (!normalizedSlug) {
      // Get all articles and sort by date to find the latest
      const articles = getAllArticles()
      const sortedArticles = articles.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      if (sortedArticles.length > 0) {
        return sortedArticles[0]
      }
    } else {
      return articlesContext(`./${normalizedSlug}.json`)
    }

    // If no articles found or error occurs, return under construction content
    return {
      id: 'index',
      title: 'Articles',
      description: 'Our articles section is currently under construction.',
      author: 'System',
      date: new Date().toISOString(),
      blocks: [
        {
          id: '1',
          type: 'heading',
          content: 'Articles',
          metadata: { level: 1 }
        },
        {
          id: '2',
          type: 'paragraph',
          content: 'Our articles section is currently under construction. Please check back later.'
        },
        {
          id: '3',
          type: 'paragraph',
          content: 'In the meantime, you can explore other sections of our site or browse through our existing articles.'
        }
      ]
    }
  } catch (error) {
    console.error(`Error reading file: ${slug}.json`, error)
    throw new Error(`Article not found: ${slug}`)
  }
}

export function getAllArticles(): BlogPost[] {
  return articlesContext.keys()
    .filter(fileName => fileName !== './_meta.json')
    .map(fileName => {
      const slug = fileName.replace(/^\.\//, '').replace(/\.json$/, '')
      return getArticleBySlug(slug)
    })
}
