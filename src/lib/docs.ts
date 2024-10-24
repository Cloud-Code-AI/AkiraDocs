import fs from 'fs'
import path from 'path'
import { BlogPost } from '@/types/Block'

const docsDirectory = path.join(process.cwd(), 'content/docs')

export function getDocById(id: string): BlogPost {
  const fullPath = path.join(docsDirectory, `${id}.json`)
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    return JSON.parse(fileContents)
  } catch (error) {
    console.error(`Error reading file: ${fullPath}`, error)
    throw new Error(`Document not found: ${id}`)
  }
}

export function getAllDocs(): BlogPost[] {
  const fileNames = fs.readdirSync(docsDirectory)
  return fileNames.map(fileName => {
    const id = fileName.replace(/\.json$/, '')
    return getDocById(id)
  })
}