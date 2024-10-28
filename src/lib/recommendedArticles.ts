"use client"

// Exclude _meta.json files from articles and docs context
const articlesContext = require.context('../../_content/articles', false, /^(?!.*_meta\.json$).*\.json$/)
const docsContext = require.context('../../_content/docs', false, /^(?!.*_meta\.json$).*\.json$/)
const configContext = require.context('../../_content', false, /_config\.json$/)

export function getRecommendedArticles(): Article[] | null {
  try {
    // Get config file
    const configFile = configContext.keys()[0]
    const config = configContext(configFile)
    
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
            publishDate: new Date(article.date)
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
            publishDate: new Date(doc.date)
          })
        }
      }
    } else {
      const allFiles = [
        ...articlesContext.keys().map(key => ({ key, context: 'articles' })),
        ...docsContext.keys().map(key => ({ key, context: 'docs' }))
      ]
      
      const sortedFiles = allFiles
        .map(({ key, context }) => {
          const content = context === 'articles' 
            ? articlesContext(key)
            : docsContext(key)
          return {
            context,
            id: content.id,
            date: new Date(content.date)
          }
        })
        .sort((a, b) => b.date.getTime() - a.date.getTime())
        .slice(0, 3)
      
      for (const { context, id } of sortedFiles) {
        if (context === 'articles') {
          const articleFile = `./${id}.json`
          if (articlesContext.keys().includes(articleFile)) {
            const article = articlesContext(articleFile)
            articles.push({
              id: article.id,
              title: article.title,
              description: article.description,
              author: article.author,
              publishDate: new Date(article.date),
              context: context
            })
          }
        } else {
          const docFile = `./${id}.json`
          if (docsContext.keys().includes(docFile)) {
            const doc = docsContext(docFile)
            articles.push({
              id: doc.id,
              title: doc.title,
              description: doc.description,
              author: doc.author,
              publishDate: new Date(doc.date),
              context: context
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
