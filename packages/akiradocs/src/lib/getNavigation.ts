"use client"

const docsContext = require.context('../../_contents/docs', true, /_meta\.json$/)
const articlesContext = require.context('../../_contents/articles', true, /_meta\.json$/)

export function getDocsNavigation<T>(defaultValue: T): T {
  try {
    const navigationFile = docsContext.keys()[0]
    return docsContext(navigationFile) as T
  } catch (error) {
    console.warn(`Failed to read docs _meta.json file. Using default value.`)
    return defaultValue
  }
}

export function getArticlesNavigation<T>(defaultValue: T): T {
  try {
    const navigationFile = articlesContext.keys()[0]
    return articlesContext(navigationFile) as T
  } catch (error) {
    console.warn(`Failed to read articles _meta.json file. Using default value.`)
    return defaultValue
  }
}