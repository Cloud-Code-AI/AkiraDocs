import { writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { type, name, parentPath } = await request.json()
    
    const fullPath = path.join(process.cwd(), 'content', parentPath, name)

    if (type === 'folder') {
      await mkdir(fullPath, { recursive: true })
    } else {
      await writeFile(fullPath, JSON.stringify({}, null, 2))
    }

    return NextResponse.json({ success: true, path: fullPath })
  } catch (error) {
    console.error('Error creating file/folder:', error)
    return NextResponse.json(
      { error: 'Failed to create file/folder' },
      { status: 500 }
    )
  }
}
