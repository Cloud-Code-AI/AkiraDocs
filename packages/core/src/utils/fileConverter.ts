import { readFileSync, writeFileSync, existsSync } from 'fs'
import { parseMarkdown } from '@/content/markdown'
import { BlogPost } from '@/types/Block'

export async function convertMarkdownToJson(mdPath: string): Promise<BlogPost> {
  try {
    const mdContent = readFileSync(mdPath, 'utf-8')
    const parsedContent = parseMarkdown(mdContent)
    
    // Generate JSON path from markdown path
    const jsonPath = mdPath.replace(/\.md$/, '.json')
    
    // Store as JSON
    writeFileSync(jsonPath, JSON.stringify(parsedContent, null, 2))
    
    return parsedContent
  } catch (error) {
    console.error(`Error converting markdown to JSON: ${mdPath}`, error)
    throw error
  }
}

export function ensureJsonExists(filePath: string): string {
  if (filePath.endsWith('.md')) {
    const jsonPath = filePath.replace(/\.md$/, '.json')
    if (!existsSync(jsonPath)) {
      convertMarkdownToJson(filePath)
    }
    return jsonPath
  }
  return filePath
} 