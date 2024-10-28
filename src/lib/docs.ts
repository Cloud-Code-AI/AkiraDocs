import { BlogPost } from '@/types/Block'

const docsContext = require.context('../../_content/docs', true, /\.json$/)

export function getDocBySlug(slug: string): BlogPost {
  try {
    // If slug is empty, use 'index'
    const normalizedSlug = slug || 'index'
    console.log(`./${normalizedSlug}.json`)
    return docsContext(`./${normalizedSlug}.json`)
  } catch (error) {
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
