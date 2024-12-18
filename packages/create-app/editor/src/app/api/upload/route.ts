import { writeFile, unlink } from 'fs/promises'
import { NextRequest, NextResponse } from 'next/server'
import path from 'path'

// Define allowed file extensions and their corresponding MIME types
const ALLOWED_FILE_TYPES = new Set([
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'text/plain',
  'text/csv',
  // Audio
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  // Video
  'video/mp4',
  'video/webm',
  'video/ogg',
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  // Code
  'text/javascript',
  'application/json',
  'text/html',
  'text/css',
  'text/markdown'
])

// Maximum file size (in bytes) - 50MB
const MAX_FILE_SIZE = 50 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 50MB limit' }, 
        { status: 400 }
      )
    }

    // Check file type
    if (!ALLOWED_FILE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'File type not allowed' }, 
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate a unique filename while preserving the original extension
    const fileExtension = path.extname(file.name)
    const baseFilename = path.basename(file.name, fileExtension)
    const sanitizedFilename = baseFilename.replace(/[^a-zA-Z0-9]/g, '_')
    const uniqueFilename = `${Date.now()}-${sanitizedFilename}${fileExtension}`

    // Save to editor's public folder
    const editorPublicPath = path.join(process.cwd(), 'public', uniqueFilename)
    await writeFile(editorPublicPath, buffer)

    return NextResponse.json({ 
      filename: uniqueFilename,
      originalName: file.name,
      type: file.type,
      size: file.size
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' }, 
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const filename = request.nextUrl.searchParams.get('filename')
    if (!filename) {
      return NextResponse.json({ error: 'No filename provided' }, { status: 400 })
    }

    const editorPublicPath = path.join(process.cwd(), 'public', filename)
    await unlink(editorPublicPath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting file:', error)
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 })
  }
} 