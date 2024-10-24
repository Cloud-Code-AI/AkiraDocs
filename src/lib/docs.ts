import { BlogPost } from '@/types/Block'

const docsContext = require.context('../../_content/docs', true, /\.json$/)

export function getDocBySlug(slug: string): BlogPost {
  try {
    // Replace forward slashes with backslashes for Windows compatibility
    const normalizedSlug = slug
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
