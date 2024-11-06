// import { BlogPost } from '@/types/Block'

// const docsContext = require.context('../../_contents/docs', true, /\.json$/)

// export function getDocBySlug(slug: string): BlogPost {
//   let normalizedSlug: string
//   if (slug.includes('_contents/docs')) {
//     normalizedSlug = slug.split('/').slice(2).join('/') || ''
//   } else {
//     normalizedSlug = slug || ''
//   }


//   try {
//     if (normalizedSlug === '') {
//       // Get all articles and sort by date to find the latest
//       const docs = getAllDocs()
//       .filter(doc => doc.id !== 'index') // Exclude index to avoid potential circular reference
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  
//     if (docs.length > 0) {
//         return docs[0]
//       }
//     } else {
//       return docsContext(`./${normalizedSlug}.json`)
//     }

//         // If no docs found, return placeholder content
//         return {
//           id: 'index',
//           title: 'Documentation',
//           description: 'Our documentation is currently under construction.',
//           author: 'System',
//           date: new Date().toISOString(),
//           blocks: [
//             {
//               id: '1',
//               type: 'heading',
//               content: 'Documentation',
//               metadata: { level: 1 }
//             },
//             {
//               id: '2',
//               type: 'paragraph',
//               content: 'Our documentation is currently under construction. Please check back later.'
//             },
//             {
//               id: '3',
//               type: 'paragraph',
//               content: 'In the meantime, you can explore other sections of our site or contact our support team for assistance.'
//             }
//           ]
//         }
//   } catch (error) {
//     console.error(`Error reading file: ${normalizedSlug}.json`, error)
//     throw new Error(`Document not found: ${normalizedSlug}`)
//   }
// }

// export function getAllDocs(): BlogPost[] {
//   return docsContext.keys()
//     .filter(fileName => fileName !== './_meta.json')
//     .map(fileName => {
//       const slug = fileName.replace(/^\.\//, '').replace(/\.json$/, '')
//       return getDocBySlug(slug)
//     })
// }
