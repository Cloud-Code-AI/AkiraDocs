import { BlogPost } from '@/types/Block'
declare var require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): any;
};
const contentContext = require.context(`../../compiled/`, true, /\.json$/)

export function getContentBySlug(locale: string, type: string, slug: string): BlogPost {

  let normalizedSlug: string
  if (slug.includes(`compiled/${locale}/${type}`)) {
    normalizedSlug = slug.split('/').slice(3).join('/') || ''
    console.log(normalizedSlug)
  } else {
    normalizedSlug = slug || ''
  }
  console.log(normalizedSlug, type)
  try {
      if (normalizedSlug === '') {
        // Get all articles and sort by date to find the latest
        if (type === 'articles') {
          const articles = getAllPosts(locale, type)
          const sortedArticles = articles.sort((a, b) =>
            new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
          )
          console.log(sortedArticles)
          if (sortedArticles.length > 0) {
            return sortedArticles[0]
        }
      }

    }
    return contentContext(`./${locale}/${type}/${normalizedSlug}.json`)

  } catch (error) {
    console.error(`Error reading file: ${normalizedSlug}.json`, error)
    throw new Error(`Content not found: ${normalizedSlug}`)
  }
}

export function getAllPosts(locale: string, type: string): BlogPost[] {
  return contentContext.keys()
    .filter((fileName: string) => fileName !== `./${locale}/${type}/_meta.json`)
    .map((fileName: string) => {
      const slug = fileName.replace(/^\.\//, '').replace(/\.json$/, '')
      return getContentBySlug(locale, type, slug)
    })
}

export function getContentNavigation<T>(defaultValue: T, locale: string, type: string): T {
  try {
    const navigationFile = `./${locale}/${type}/_meta.json`
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
      .filter((key: string) => key.startsWith(`./${folderPath}/`) && key.endsWith('.json') && !key.endsWith('/_meta.json'))

    if (files.length === 0) {
      return null
    }

    // Sort files by their content's date field
    const sortedFiles = files
      .map((file: string) => ({
        name: file,
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
