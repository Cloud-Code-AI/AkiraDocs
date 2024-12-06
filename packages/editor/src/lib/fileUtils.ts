export async function saveImageToPublic(file: File, oldContent?: string): Promise<string> {
  if (oldContent) {
    const oldFilename = extractFilenameFromContent(oldContent)
    if (oldFilename) {
      try {
        await deleteImageFromPublic(oldFilename)
      } catch (error) {
        console.error('Error deleting old file:', error)
      }
    }
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload image')
    }

    const data = await response.json()
    return data.filename
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export async function deleteImageFromPublic(filename: string): Promise<void> {
  try {
    const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      throw new Error('Failed to delete image')
    }
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

export async function moveImageToRoot(filename: string): Promise<void> {
  try {
    const response = await fetch(`/api/upload/move-to-root?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
    })
    
    if (!response.ok) {
      throw new Error('Failed to move image to root')
    }
  } catch (error) {
    console.error('Error moving image:', error)
    throw error
  }
}

export async function saveVideoToPublic(file: File, oldContent?: string): Promise<string> {
  if (oldContent) {
    const oldFilename = extractFilenameFromContent(oldContent)
    if (oldFilename) {
      try {
        await deleteImageFromPublic(oldFilename)
      } catch (error) {
        console.error('Error deleting old file:', error)
      }
    }
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload video')
    }

    const data = await response.json()
    return data.filename
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export async function saveAudioToPublic(file: File, oldContent?: string): Promise<string> {
  if (oldContent) {
    const oldFilename = extractFilenameFromContent(oldContent)
    if (oldFilename) {
      try {
        await deleteImageFromPublic(oldFilename)
      } catch (error) {
        console.error('Error deleting old file:', error)
      }
    }
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload audio')
    }

    const data = await response.json()
    return data.filename
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export async function saveFileToPublic(file: File, oldContent?: string): Promise<string> {
  if (oldContent) {
    const oldFilename = extractFilenameFromContent(oldContent)
    if (oldFilename) {
      try {
        await deleteImageFromPublic(oldFilename)
      } catch (error) {
        console.error('Error deleting old file:', error)
      }
    }
  }

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      throw new Error('Failed to upload file')
    }

    const data = await response.json()
    return data.filename
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export function extractFilenameFromContent(content: string): string | null {
  try {
    const parsed = JSON.parse(content)
    if (parsed.url) {
      return parsed.url.split('/').pop() || null
    }
  } catch {
    // If content is a direct URL
    return content.split('/').pop() || null
  }
  return null
}