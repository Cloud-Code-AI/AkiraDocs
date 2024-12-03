'use client'

import { useState, KeyboardEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Folder, File, Plus, X, ChevronRight, ChevronDown, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAllContent } from '@/src/lib/getContents'
import { ThemeToggle } from "@/components/ui/ThemeToggle"

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:3001'

type FileNode = {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

// Add this function to track the full path of each node
const getNodeFullPath = (tree: FileNode[], nodeId: string, parentPath: string = ''): string | null => {
  for (const node of tree) {
    const currentPath = parentPath ? `${parentPath}/${node.name}` : node.name
    if (node.id === nodeId) {
      return currentPath
    }
    if (node.children) {
      const foundPath = getNodeFullPath(node.children, nodeId, currentPath)
      if (foundPath) return foundPath
    }
  }
  return null
}

interface MetaItem {
  title: string
  path?: string
  items?: Record<string, MetaItem>
}

interface FolderMeta {
  [key: string]: MetaItem
}

interface RootMeta {
  defaultRoute?: string
  [key: string]: MetaItem | string | undefined
}

export default function ImprovedFileTreeUI() {
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const router = useRouter()
  const isDevPage = process.env.NEXT_PUBLIC_AKIRADOCS_EDIT_MODE === 'true'

  // Get this from the backend
  useEffect(() => {
    const content = fetchAllContent()
    const transformedTree = transformContentToFileTree(content)
    setFileTree(transformedTree)
  }, [])

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['1', '4']))
  const [newItemParent, setNewItemParent] = useState<string | null>(null)
  const [newItemType, setNewItemType] = useState<'file' | 'folder' | null>(null)
  const [newItemName, setNewItemName] = useState('')

  const toggleFolder = (folderId: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev)
      if (newSet.has(folderId)) {
        newSet.delete(folderId)
      } else {
        newSet.add(folderId)
      }
      return newSet
    })
  }

  const handleFileClick = (node: FileNode) => {
    // Get the full path for the file
    const fullPath = getNodeFullPath(fileTree, node.id)
    if (!fullPath) {
      console.error('Could not find full path for node')
      return
    }

    // Encode the file path to handle special characters in URLs
    const encodedPath = encodeURIComponent(fullPath)
    router.push(`/editMode/${fullPath}`)
  }

  const startNewItem = (parentId: string, type: 'file' | 'folder') => {
    setNewItemParent(parentId)
    setNewItemType(type)
    setNewItemName('')
  }

  const cancelNewItem = () => {
    setNewItemParent(null)
    setNewItemType(null)
    setNewItemName('')
  }

  const addNewItem = async () => {
    if (!newItemParent || !newItemType || !newItemName) return

    const newItem: FileNode = {
      id: Date.now().toString(),
      name: newItemName,
      type: newItemType,
      children: newItemType === 'folder' ? [] : undefined
    }

    const parentPath = getNodeFullPath(fileTree, newItemParent)
    if (!parentPath) {
      console.error('Could not find parent path')
      return
    }

    const fullPath = `${parentPath}/${newItemName}`

    if (newItemType === 'file') {
      try {
        // Get the language and section from the path
        const pathParts = parentPath.split('/')
        const language = pathParts[0] // e.g. 'en'
        const section = pathParts[1] // e.g. 'docs'
        
        // Create default content for the new file
        const fileId = newItemName.replace('.json', '')
        const defaultContent = {
          title: fileId.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' '),
          description: "",
          author: "Anonymous",
          publishDate: new Date().toISOString(),
          modifiedDate: new Date().toISOString(),
          blocks: []
        }

        // Create the new file
        const fileResponse = await fetch(`${API_URL}/api/files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: fullPath,
            content: defaultContent
          })
        })

        if (!fileResponse.ok) throw new Error('Failed to create file')

        // Update folder level _meta.json
        const folderMetaPath = `${parentPath}/_meta.json`
        let folderMeta: FolderMeta = {}
        
        try {
          const folderMetaResponse = await fetch(`${API_URL}/api/files?path=${encodeURIComponent(folderMetaPath)}`)
          if (folderMetaResponse.ok) {
            folderMeta = await folderMetaResponse.json()
          }
        } catch (error) {
          console.log('No existing folder meta found')
        }

        // Add the new file to folder meta
        folderMeta[fileId] = {
          title: defaultContent.title,
          path: `/${section}/${pathParts.slice(2).join('/')}/${fileId}`
        }

        // Save folder meta
        await fetch(`${API_URL}/api/files`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: folderMetaPath,
            content: folderMeta
          })
        })

        // Update root level _meta.json
        const rootMetaPath = `${language}/${section}/_meta.json`
        const rootMetaResponse = await fetch(`${API_URL}/api/files?path=${encodeURIComponent(rootMetaPath)}`)
        
        if (rootMetaResponse.ok) {
          const rootMeta = await rootMetaResponse.json() as RootMeta
          
          // Navigate through the path to find the right section
          let currentSection = rootMeta
          for (let i = 2; i < pathParts.length; i++) {
            const part = pathParts[i]
            
            // Convert path to camelCase for section key
            const sectionKey = part.replace(/-/g, ' ')
              .split(' ')
              .map((word, index) => {
                const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
                return index === 0 ? capitalized.toLowerCase() : capitalized
              })
              .join('')

            // Create section if it doesn't exist
            if (!currentSection[sectionKey]) {
              const newSection: MetaItem = {
                title: part.split('-')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' '),
                items: {}
              }
              currentSection[sectionKey] = newSection
            }
            
            // Move to items object for next iteration
            const section = currentSection[sectionKey] as MetaItem
            const items = section?.items
            if (!items) {
              currentSection[sectionKey] = {
                ...section,
                items: {}
              }
              currentSection = currentSection[sectionKey].items!
            } else {
              currentSection = items
            }
          }

          // Add the new file entry
          currentSection[fileId] = {
            title: defaultContent.title,
            path: `/${section}/${pathParts.slice(2).join('/')}/${fileId}`
          }

          // Save updated root meta
          await fetch(`${API_URL}/api/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              path: rootMetaPath,
              content: rootMeta
            })
          })
        }

      } catch (error) {
        console.error('Error creating file or updating metadata:', error)
        return
      }
    }

    // Update the file tree UI
    const updatedTree = addItemToTree(fileTree, newItemParent, newItem)
    setFileTree(updatedTree)

    if (newItemType === 'folder') {
      setExpandedFolders(prev => new Set(prev).add(newItem.id))
    }

    cancelNewItem()
  }

  const addItemToTree = (tree: FileNode[], parentId: string, newItem: FileNode): FileNode[] => {
    return tree.map(node => {
      if (node.id === parentId) {
        return { ...node, children: [...(node.children || []), newItem] }
      }
      if (node.children) {
        return { ...node, children: addItemToTree(node.children, parentId, newItem) }
      }
      return node
    })
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addNewItem()
    }
  }

  const renderFileTree = (nodes: FileNode[], level: number = 0) => {
    return (
      <ul className={`space-y-1 ${level > 0 ? 'border-l border-border ml-4 pl-4' : ''}`}>
        {nodes.map((node) => (
          <li key={node.id} className="relative">
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center flex-grow">
                {node.type === 'folder' && (
                  <button
                    onClick={() => toggleFolder(node.id)}
                    className="mr-1 focus:outline-none"
                    aria-label={expandedFolders.has(node.id) ? "Collapse folder" : "Expand folder"}
                  >
                    {expandedFolders.has(node.id) ? (
                      <ChevronDown className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    )}
                  </button>
                )}
                <div className="h-4 w-4 mr-1">
                  {node.type === 'folder' ? (
                    <Folder className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <File className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <span 
                  className={`text-sm ${node.type === 'folder' ? 'font-semibold' : ''} text-foreground hover:text-primary transition-colors duration-200 cursor-pointer`}
                  onClick={() => node.type === 'file' ? handleFileClick(node) : toggleFolder(node.id)}
                >
                  {node.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {node.type === 'folder' && (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-accent"
                      onClick={() => startNewItem(node.id, 'file')}
                    >
                      <File className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6 p-0 hover:bg-accent"
                      onClick={() => startNewItem(node.id, 'folder')}
                    >
                      <Folder className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => deleteItem(node.id, node.name, node.type)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {node.type === 'folder' && node.children && (
              <AnimatePresence>
                {expandedFolders.has(node.id) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="mt-1">
                      {renderFileTree(node.children, level + 1)}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
            {newItemParent === node.id && (
              <div className="flex items-center mt-2 pr-8">
                <Input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`New ${newItemType}`}
                  className="h-8 text-sm bg-background text-foreground flex-grow"
                />
                <Button onClick={addNewItem} size="sm" className="ml-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button onClick={cancelNewItem} size="sm" variant="ghost" className="ml-1 text-muted-foreground">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    )
  }

  const transformContentToFileTree = (content: { [key: string]: any }): FileNode[] => {
    const tree: { [key: string]: FileNode } = {}
    let rootNodes: FileNode[] = []

    // Create nodes for each path
    Object.keys(content).forEach(path => {
      const parts = path.split('/')
      let currentPath = ''
      
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1
        const fullPath = currentPath ? `${currentPath}/${part}` : part
        const nodeId = fullPath.replace(/[/.]/g, '_')

        if (!tree[fullPath]) {
          tree[fullPath] = {
            id: nodeId,
            name: part,
            type: isFile ? 'file' : 'folder',
            children: isFile ? undefined : []
          }
        }

        if (index === 0) {
          if (!rootNodes.find(node => node.id === nodeId)) {
            rootNodes.push(tree[fullPath])
          }
        } else {
          const parentPath = currentPath
          const parent = tree[parentPath]
          if (parent && parent.children && !parent.children.find(child => child.id === nodeId)) {
            parent.children.push(tree[fullPath])
          }
        }

        currentPath = fullPath
      })
    })

    return rootNodes
  }

  const deleteItem = async (nodeId: string, nodeName: string, nodeType: 'file' | 'folder') => {
    try {
      // Get the full path of the node
      const fullPath = getNodeFullPath(fileTree, nodeId)
      if (!fullPath) {
        console.error('Could not find full path for node')
        return
      }

      // Confirmation dialog
      const confirmMessage = `Are you sure you want to delete this ${nodeType}${nodeType === 'folder' ? ' and all its contents' : ''}?`
      if (!confirm(confirmMessage)) {
        return
      }

      const pathParts = fullPath.split('/')
      const language = pathParts[0] // e.g. 'en'
      const section = pathParts[1] // e.g. 'docs'
      const fileId = nodeName.replace('.json', '')

      // Delete the file/folder first
      const response = await fetch(`${API_URL}/api/files`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: fullPath,
          type: nodeType
        })
      })

      if (!response.ok) {
        throw new Error('Failed to delete item')
      }

      if (nodeType === 'file') {
        // Update folder level _meta.json
        const folderMetaPath = `${pathParts.slice(0, -1).join('/')}/_meta.json`
        try {
          const folderMetaResponse = await fetch(`${API_URL}/api/files?path=${encodeURIComponent(folderMetaPath)}`)
          if (folderMetaResponse.ok) {
            const folderMeta: FolderMeta = await folderMetaResponse.json()
            
            // Remove the file from folder meta
            delete folderMeta[fileId]

            // Save updated folder meta
            await fetch(`${API_URL}/api/files`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                path: folderMetaPath,
                content: folderMeta
              })
            })
          }
        } catch (error) {
          console.log('No folder meta found or error updating it:', error)
        }

        // Update root level _meta.json
        const rootMetaPath = `${language}/${section}/_meta.json`
        const rootMetaResponse = await fetch(`${API_URL}/api/files?path=${encodeURIComponent(rootMetaPath)}`)
        
        if (rootMetaResponse.ok) {
          const rootMeta = await rootMetaResponse.json() as RootMeta
          
          let currentSection = rootMeta
          let parent = null
          
          for (let i = 2; i < pathParts.length - 1; i++) {
            const part = pathParts[i]
            
            const sectionKey = part.replace(/-/g, ' ')
              .split(' ')
              .map((word, index) => {
                const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
                return index === 0 ? capitalized.toLowerCase() : capitalized
              })
              .join('')

            const section = currentSection[sectionKey] as MetaItem
            if (!section || !section.items) {
              console.error('Section not found in root meta:', sectionKey)
              return
            }

            parent = currentSection
            currentSection = section.items
          }

          // Remove the file entry
          delete currentSection[fileId]

          // If section is empty and not root level, remove the section
          if (parent && Object.keys(currentSection).length === 0) {
            const lastPart = pathParts[pathParts.length - 2]
            const lastSectionKey = lastPart.replace(/-/g, ' ')
              .split(' ')
              .map((word, index) => {
                const capitalized = word.charAt(0).toUpperCase() + word.slice(1)
                return index === 0 ? capitalized.toLowerCase() : capitalized
              })
              .join('')
            delete parent[lastSectionKey]
          }

          // Save updated root meta
          await fetch(`${API_URL}/api/files`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              path: rootMetaPath,
              content: rootMeta
            })
          })
        }
      }

      // Update the file tree UI
      const updatedTree = deleteItemFromTree(fileTree, nodeId)
      setFileTree(updatedTree)

    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const deleteItemFromTree = (tree: FileNode[], nodeId: string): FileNode[] => {
    return tree.filter(node => {
      if (node.id === nodeId) {
        return false;
      }
      if (node.children) {
        node.children = deleteItemFromTree(node.children, nodeId);
      }
      return true;
    });
  }

  // if (!isDevPage) {
  //   router.push('/docs')
  //   return null
  // }

  return (
    <div className="p-6 bg-background min-h-screen text-foreground">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          Project Explorer
        </h1>
        <ThemeToggle />
      </div>
      <div className="bg-card rounded-lg shadow-xl p-6 border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderFileTree(fileTree)}
        </motion.div>
      </div>
    </div>
  )
}
