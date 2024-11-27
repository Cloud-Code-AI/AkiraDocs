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
    throw new Error('Failed to rewrite content')
  }

  const data = await response.json()
  return data.content
}