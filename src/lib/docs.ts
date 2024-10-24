import { BlogPost } from '@/types/Block'

const docsContext = require.context('../../content/docs', true, /\.json$/)

export function getDocById(id: string): BlogPost {
  try {
    return docsContext(`./${id}.json`)
  } catch (error) {
    console.error(`Error reading file: ${id}.json`, error)
    throw new Error(`Document not found: ${id}`)
  }
}

export function getAllDocs(): BlogPost[] {
  return docsContext.keys().map(fileName => {
    const id = fileName.replace(/^\.\//, '').replace(/\.json$/, '')
    return getDocById(id)
  })
}
