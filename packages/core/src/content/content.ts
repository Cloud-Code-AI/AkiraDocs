
import { BlogPost } from '@/types/Block'
import { parseMarkdown } from './markdown'
import path from 'path'

const contentContext = require.context('../../_contents', false, /_config\.json$/);
export function getContentBySlug(type: string, slug: string) {
  let normalizedSlug

  if (slug.includes("_contents/".concat(type))) {
    normalizedSlug = slug.split('/').slice(2).join('/') || ''
  } else {
    normalizedSlug = slug || ''
  }

  try {
    if (normalizedSlug === '') {
      if (type === 'articles') {
        const articles = getAllPosts(type)
        const sortedArticles = articles.sort((a, b) => 
          new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
        )
        if (sortedArticles.length > 0) {
          return sortedArticles[0]
        }
      }
    }

    try {
      return contentContext("./".concat(config.format, "/").concat(type, "/").concat(normalizedSlug, ".json"))
    } catch (jsonError) {
      if (config.format === 'markdown') {
        const mdPath = "./".concat(config.format, "/").concat(type, "/").concat(normalizedSlug, ".md")
        const mdContent = contentContext(mdPath)
        const parsedContent = parseMarkdown(mdContent)
        return parsedContent
      } else if (config.format === 'json' || config.format === 'both') {
        const jsonPath = path.join(process.cwd(), '_contents', format, type, `${normalizedSlug}.json`)
        return contentContext(jsonPath)
      }
      throw jsonError
    }
  } catch (error) {
    console.error(`Error reading file: ${normalizedSlug}`, error)
    throw new Error(`Content not found: ${normalizedSlug}`)
  }
}

export function getAllPosts(type: string): BlogPost[] {
  return contentContext.keys()
    .filter((fileName: string) => {
      // Exclude meta files and only include supported formats
      return fileName !== `./${type}/_meta.json` && 
             (fileName.endsWith('.json') || 
              (config.format !== 'json' && fileName.endsWith('.md')))
    })
    .map((fileName: string) => {
      const slug = fileName.replace(/^\.\//, '').replace(/\.(json|md)$/, '')
      return getContentBySlug(type, slug)
    })
}

export function getContentNavigation<T>(defaultValue: T, type: string): T {
  try {
    const navigationFile = `./${config.format}/${type}/_meta.json`
    return contentContext(navigationFile) as T
  } catch (error) {
    console.warn(`Failed to read ${type} _meta.json file. Using default value.`)
    return defaultValue
  }
}

export function getRecentContent(folderPath: string) {
  try {
    // Get all matching files using require.context
    const files = contentContext.keys()
      .filter((key: string) => key.startsWith(`./${config.format}/${folderPath}/`) && key.endsWith('.json') && !key.endsWith('/_meta.json'))

    if (files.length === 0) {
      return null
    }

    // Sort files by their content's date field
    const sortedFiles = files
      .map((file: string) => ({
        name: file.replace(`./${config.format}/${folderPath}/`, ''),
        content: contentContext(file)
      }))
      .sort((a: any, b: any) => new Date(b.content.date).getTime() - new Date(a.content.date).getTime())

    // Return the most recent file's information
    return {
      slug: sortedFiles[0].name.replace(`./${folderPath}/`, '').replace('.json', '')
    }
  } catch (error) {
    console.error('Error finding recent article:', error)
    return null
  }
}

export function folderExists(folderPath: string): boolean {
  try {
    return contentContext.keys().some((key: string) => key.startsWith(`./${folderPath}/`))
  } catch (error) {
    console.error('Error checking folder existence:', error)
    return false
  }
}
