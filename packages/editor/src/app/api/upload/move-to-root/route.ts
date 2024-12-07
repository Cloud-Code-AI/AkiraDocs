import { NextRequest, NextResponse } from 'next/server'
import { copyFile, unlink } from 'fs/promises'
import path from 'path'

export async function POST(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('filename')
    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 })
    }

    const editorPublicPath = path.join(process.cwd(), 'public', filename)
    const rootPublicPath = path.join(process.cwd(), '..', 'public', filename)

    // Copy to root public folder
    await copyFile(editorPublicPath, rootPublicPath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error moving file to root:', error)
    return NextResponse.json({ error: 'Failed to move file' }, { status: 500 })
  }
} 