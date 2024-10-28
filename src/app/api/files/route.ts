import { writeFile, mkdir, rm, unlink } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function POST(request: Request) {
  try {
    const { path: filePath, content } = await request.json()
    
    // Ensure the directory exists
    const fullPath = path.join(process.cwd(), '_content', filePath)
    await mkdir(path.dirname(fullPath), { recursive: true })
    
    // Write the file
    await writeFile(fullPath, JSON.stringify(content, null, 2))
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error creating file:', error)
    return NextResponse.json(
      { error: 'Failed to create file' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { path: itemPath, type } = await request.json()
    const fullPath = path.join(process.cwd(), '_content', itemPath)

    if (type === 'folder') {
      await rm(fullPath, { recursive: true, force: true })
    } else {
      await unlink(fullPath)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
