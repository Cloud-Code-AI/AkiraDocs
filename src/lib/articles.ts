import { BlogPost } from '@/types/Block'

const articlesContext = require.context('../../_content/articles', true, /\.json$/)

export function getArticleBySlug(slug: string): BlogPost {
  try {
    // Replace forward slashes with backslashes for Windows compatibility
    const normalizedSlug = slug
    console.log(`./${normalizedSlug}.json`)
    return articlesContext(`./${normalizedSlug}.json`)
  } catch (error) {
    console.error(`Error reading file: ${slug}.json`, error)
    throw new Error(`Article not found: ${slug}`)
  }
}

export function getAllArticles(): BlogPost[] {
  return articlesContext.keys().map(fileName => {
    const slug = fileName.replace(/^\.\//, '').replace(/\.json$/, '')
    return getArticleBySlug(slug)
  })
}
