"use client"

// Exclude _meta.json files from articles context
const articlesContext = require.context('../../_content/articles', false, /^(?!.*_meta\.json$).*\.json$/)
const configContext = require.context('../../_content', false, /_config\.json$/)

export function getRecommendedArticles(): Article[] | null {
  try {
    // Get config file
    const configFile = configContext.keys()[0]
    const config = configContext(configFile)
    
    // Return null if recommendedArticles is false
    if (config.recommendedArticles === false) {
      return null
    }
    
    let articles: Article[] = []
    
    // If recommended articles are specified in config
    if (config.recommendedArticles && config.recommendedArticles.length > 0) {
      // Get only the specified articles
      for (const articleId of config.recommendedArticles) {
        const articleFile = `./${articleId}.json`
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
      }
    } else {
      // Get first 3 articles by default
      const articleFiles = articlesContext.keys()
        .slice(0, 3)
      
      for (const file of articleFiles) {
        const article = articlesContext(file)
        articles.push({
          id: article.id,
          title: article.title,
          description: article.description,
          author: article.author,
          publishDate: new Date(article.date)
        })
      }
    }
    
    return articles
  } catch (error) {
    console.warn('Failed to read recommended articles. Returning empty array.', error)
    return []
  }
}
