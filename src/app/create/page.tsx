'use client'

import { useState, KeyboardEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Folder, File, Plus, X, ChevronRight, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAllContent } from '@/lib/getContents'

type FileNode = {
  id: string
  name: string
  displayName?: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

export default function ImprovedFileTreeUI() {
  const [fileTree, setFileTree] = useState<FileNode[]>([])
  const router = useRouter()

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

  const handleFileClick = (filePath: string) => {
    router.push(`/editor/${filePath}`)
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

  const addNewItem = () => {
    if (!newItemParent || !newItemType || !newItemName) return

    const newItem: FileNode = {
      id: Date.now().toString(),
      name: newItemType === 'file' ? `${newItemName}.json` : newItemName,
      type: newItemType,
      children: newItemType === 'folder' ? [] : undefined
    }

    const updatedTree = addItemToTree(fileTree, newItemParent, newItem)
    setFileTree(updatedTree)

    if (newItemType === 'folder') {
      setExpandedFolders(prev => new Set(prev).add(newItem.id))
    }

    if (newItemType === 'file') {
      router.push(`/editor/${newItemParent}/${newItemName}`)
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
      <ul className={`space-y-1 ${level > 0 ? 'border-l border-gray-300 ml-4 pl-4' : ''}`}>
        {nodes.map((node) => (
          <li key={node.id} className="relative">
            <div className="flex items-center justify-between py-1 group">
              <div className="flex items-center flex-grow">
                {node.type === 'folder' && (
                  <button
                    onClick={() => toggleFolder(node.id)}
                    className="mr-1 focus:outline-none"
                    aria-label={expandedFolders.has(node.id) ? "Collapse folder" : "Expand folder"}
                  >
                    {expandedFolders.has(node.id) ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                )}
                <span 
                  className={`text-sm ${node.type === 'folder' ? 'font-semibold' : ''} text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer`}
                  onClick={() => node.type === 'file' ? handleFileClick(node.name) : toggleFolder(node.id)}
                >
                  {node.displayName || node.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {node.type === 'folder' && (
                  <>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200"
                            onClick={() => startNewItem(node.id, 'file')}
                          >
                            <File className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>New File</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-gray-200"
                            onClick={() => startNewItem(node.id, 'folder')}
                          >
                            <Folder className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>New Folder</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="h-4 w-4">
                        {node.type === 'folder' ? (
                          <Folder className="h-4 w-4 text-gray-400" />
                        ) : (
                          <File className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{node.type === 'folder' ? 'Folder' : 'File'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
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
                  className="h-8 text-sm bg-white border-gray-300 text-gray-700 flex-grow"
                />
                <Button onClick={addNewItem} size="sm" className="ml-2 bg-gray-200 hover:bg-gray-300 text-gray-700">
                  <Plus className="w-4 h-4" />
                </Button>
                <Button onClick={cancelNewItem} size="sm" variant="ghost" className="ml-1 text-gray-700">
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
    const metaData = content['_meta.json'] || {}

    // Create nodes for each path
    Object.keys(content).forEach(path => {
      // Skip _meta.json file
      if (path === '_meta.json') return

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
            displayName: isFile ? metaData[fullPath]?.title || part : part,
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

  return (
    <div className="p-6 bg-white min-h-screen text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Project Explorer
      </h1>
      <div className="bg-gray-100 rounded-lg shadow-xl p-6 border border-gray-200">
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
