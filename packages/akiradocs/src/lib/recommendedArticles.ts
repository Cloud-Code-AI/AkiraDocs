"use client"

import { Article } from "@/types/Article"
import { getAkiradocsConfig } from "@/lib/getAkiradocsConfig"
declare var require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): any;
};
// Match files in locale subdirectories that contain 'article' or 'docs', excluding _meta.json
const articlesContext = require.context('../../compiled', true, /^\.\/[^/]+\/(article|docs)\/(?!.*_meta\.json$).*\.json$/)
const docsContext = require.context('../../compiled', true, /^\.\/[^/]+\/(article|docs)\/(?!.*_meta\.json$).*\.json$/)

export function getRecommendedArticles(): Article[] | null {
  try {
    // Get config file
    const config = getAkiradocsConfig()

    let articles: Article[] = []

    const allFiles = [
      ...articlesContext.keys().map((key: string) => ({ key, context: 'articles' })),
      ...docsContext.keys().map((key: string) => ({ key, context: 'docs' }))
    ]

    const sortedFiles = allFiles
      .map(({ key, context }) => {
        const content = context === 'articles'
          ? articlesContext(key)
          : docsContext(key)
        return {
          context,
          key,
          id: content.id,
          date: new Date(content.date)
        }
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 3)

    for (const file of sortedFiles) {
      // Set id from key if undefined
      if (!file.id) {
        file.id = file.key.split('/').pop()?.replace('.json', '')
      }

      if (file.context === 'articles') {
        const articleFile = `./${file.id}.json`
        if (articlesContext.keys().includes(articleFile)) {
          const article = articlesContext(articleFile)
          articles.push({
            id: file.id,
            title: article.title,
            description: article.description,
            author: article.author,
            publishDate: new Date(article.date),
            content: article.content
          })
        }
      } else {
        const docFile = `./${file.id}.json`
        if (docsContext.keys().includes(docFile)) {
          const doc = docsContext(docFile)
          articles.push({
            id: file.id,
            title: doc.title,
            description: doc.description,
            author: doc.author,
            publishDate: new Date(doc.date),
            content: doc.content
          })
        }
      }
    }

    return articles
  } catch (error) {
    console.warn('Failed to read recommended articles. Returning empty array.', error)
    return []
  }
}
