import { BlogPost } from '@/types/Block'
const contentContext = require.context(`../../_contents/`, true, /\.json$/)

export function getContentBySlug(type: string, slug: string): BlogPost {

  let normalizedSlug: string
  if (slug.includes(`_contents/${type}`)) {
    normalizedSlug = slug.split('/').slice(2).join('/') || ''
  } else {
    normalizedSlug = slug || ''
  }
  try {
    if (type === 'articles') {
      if (normalizedSlug === '') {
        // Get all articles and sort by date to find the latest
        const articles = getAllPosts(type)
        const sortedArticles = articles.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        if (sortedArticles.length > 0) {
          return sortedArticles[0]
        }
      } else {
        return contentContext(`./${type}/${normalizedSlug}.json`)
      }

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
    console.error(`Error reading file: ${normalizedSlug}.json`, error)
    throw new Error(`Content not found: ${normalizedSlug}`)
  }
}

export function getAllPosts(type: string): BlogPost[] {
  return contentContext.keys()
    .filter(fileName => fileName !== `./${type}/_meta.json`)
    .map(fileName => {
      const slug = fileName.replace(/^\.\//, '').replace(/\.json$/, '')
      return getContentBySlug(type, slug)
    })
}

export function getContentNavigation<T>(defaultValue: T, type: string): T {
  try {
    const navigationFile = `./${type}/_meta.json`
    return contentContext(navigationFile) as T
  } catch (error) {
    console.warn(`Failed to read ${type} _meta.json file. Using default value.`)
    return defaultValue
  }
}


export function getRecentContent(folderPath: string) {
  try {
    const fs = require('fs')
    const path = require('path')

    const folderFullPath = path.join(process.cwd(), '_contents', folderPath)

    // Check if folder exists
    if (!fs.existsSync(folderFullPath)) {
      return null
    }

    // Get all JSON files in the folder
    const files = fs.readdirSync(folderFullPath)
      .filter(file => file.endsWith('.json'))

    if (files.length === 0) {
      return null
    }

    // Sort files by modification time (most recent first)
    const sortedFiles = files
      .map(file => ({
        name: file,
        time: fs.statSync(path.join(folderFullPath, file)).mtime.getTime()
      }))
      .sort((a, b) => b.time - a.time)

    // Return the most recent file's information
    return {
      slug: sortedFiles[0].name.replace('.json', '')
    }
  } catch (error) {
    console.error('Error finding recent article:', error)
    return null
  }
}

export function folderExists(folderPath: string): boolean {
  try {
    const fs = require('fs')
    const path = require('path')
    const folderFullPath = path.join(process.cwd(), 'contents', folderPath)
    return fs.existsSync(folderFullPath)
  } catch (error) {
    console.error('Error checking folder existence:', error)
    return false
  }
}
