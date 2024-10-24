"use client"

const navigationContext = require.context('../../_content', true, /_meta\.json$/)
const footerContext = require.context('../../_content', true, /_config\.json$/)
export function getDocsNavigation<T>(defaultValue: T): T {
  try {
    const navigationFile = navigationContext.keys()[0]
    return navigationContext(navigationFile) as T
  } catch (error) {
    console.warn(`Failed to read _meta.json file. Using default value.`)
    return defaultValue
  }
}

export function getFooterData<T>(defaultValue: T): T {
  try {
    const footerFile = footerContext.keys()[0]
    return footerContext(footerFile) as T
  } catch (error) {
    console.warn(`Failed to read config.json file. Using default value.`)
    return defaultValue
  }
}