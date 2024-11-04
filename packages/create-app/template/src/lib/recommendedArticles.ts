"use client"

import { Article } from "@/types/Article"

declare var require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): any;
};
// Exclude _meta.json files from articles and docs context
const articlesContext = require.context('../../_contents/articles', false, /^(?!.*_meta\.json$).*\.json$/)
const docsContext = require.context('../../_contents/docs', false, /^(?!.*_meta\.json$).*\.json$/)
const commonContext = require.context('../../_contents', false, /_config\.json$/)

export function getRecommendedArticles(): Article[] | null {
  try {
    // Get config file
    const config = commonContext('./_config.json')
    
    if (config.recommendedArticles === false) {
      return null
    }
    
    let articles: Article[] = []
    
    if (config.recommendedArticles && config.recommendedArticles.length > 0) {
      for (const articleId of config.recommendedArticles) {
        // Check in articles folder
        const articleFile = `./articles/${articleId}.json`
        if (articlesContext.keys().includes(articleFile)) {
          const article = articlesContext(articleFile)
          articles.push({
            id: article.id,
            title: article.title,
            description: article.description,
            author: article.author,
            publishDate: new Date(article.date),
            content: article.content
          })
        }
        
        // Check in docs folder
        const docFile = `./${articleId}.json`
        if (docsContext.keys().includes(docFile)) {
          const doc = docsContext(docFile)
          articles.push({
            id: doc.id,
            title: doc.title,
            description: doc.description,
            author: doc.author,
            publishDate: new Date(doc.date),
            content: doc.content
          })
        }
      }
    } else {
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
    }

    return articles
  } catch (error) {
    console.warn('Failed to read recommended articles. Returning empty array.', error)
    return []
  }
}
