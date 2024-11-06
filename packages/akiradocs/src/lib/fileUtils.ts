// "use client"

// const navigationContext = require.context('../../content', true, /navigation\.json$/)

// export function readJsonFile<T>(defaultValue: T): T {
//   try {
//     const navigationFile = navigationContext.keys()[0]
//     return navigationContext(navigationFile) as T
//   } catch (error) {
//     console.warn(`Failed to read navigation.json file. Using default value.`)
//     return defaultValue
//   }
// }