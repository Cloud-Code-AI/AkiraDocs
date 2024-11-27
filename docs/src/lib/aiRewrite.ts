import { BlockType } from '@/types/Block'

export async function rewriteBlockContent(
  content: string, 
  blockType: BlockType, 
  style: string
): Promise<string> {
  const response = await fetch('/api/rewrite', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      content,
      blockType,
      style,
    }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error)
  }

  const data = await response.json()
  return data.content
}