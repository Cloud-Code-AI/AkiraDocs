import { BlockType } from '@/types/Block'
import { getAkiradocsConfig } from '@/lib/getAkiradocsConfig'
import { isAzureProvider } from '@/lib/AIConfig'

export async function rewriteBlockContent(
  content: string, 
  blockType: BlockType, 
  style: string
): Promise<string> {
  const config = getAkiradocsConfig()
  
  const response = await fetch('/api/rewrite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      blockType,
      style,
      provider: config.rewrite?.provider || 'openai',
      settings: {
        ...config.rewrite?.settings,
        isAzure: isAzureProvider()
      }
    }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error)
  }

  const data = await response.json()
  return data.content
}