export async function saveImageToPublic(file: File): Promise<string> {
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

export async function saveVideoToPublic(file: File): Promise<string> {
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

export async function saveAudioToPublic(file: File): Promise<string> {
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