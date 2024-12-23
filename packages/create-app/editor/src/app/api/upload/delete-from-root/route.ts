import { unlink } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

export async function DELETE(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('filename')
    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 })
    }

    const rootPublicPath = path.join(process.cwd(), '..', 'public', filename)
    await unlink(rootPublicPath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file from root:', error)
    return NextResponse.json({ error: 'Failed to delete file from root' }, { status: 500 })
  }
} 