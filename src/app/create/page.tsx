'use client'

import { useState, KeyboardEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Folder, File, Plus, X, ChevronRight, ChevronDown, Trash2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { fetchAllContent } from '@/lib/getContents'

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

  const handleFileClick = (node: FileNode) => {
    // Get the full path for the file
    const fullPath = getNodeFullPath(fileTree, node.id)
    if (!fullPath) {
      console.error('Could not find full path for node')
      return
    }

    // Encode the file path to handle special characters in URLs
    const encodedPath = encodeURIComponent(fullPath)
    router.push(`/articles?file=${encodedPath}`)
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

    // Create the actual file/folder in the local directory
    if (newItemType === 'file') {
      try {
        const defaultContent = {
          id: newItemName.replace('.json', ''),
          title: "New Article",
          description: "Add your description here",
          author: "Anonymous",
          date: new Date().toISOString().split('T')[0],
          blocks: []  // Empty blocks array
        }

        const response = await fetch('/api/files', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            path: `${getNodeFullPath(fileTree, newItemParent)}/${newItemName}`,
            content: defaultContent
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to create file');
        }
      } catch (error) {
        console.error('Error creating file:', error);
        return;
      }
    }

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
      <ul className={`space-y-1 ${level > 0 ? 'border-l border-gray-300 ml-4 pl-4' : ''}`}>
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
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                )}
                {/* File/Folder indicator moved here */}
                <div className="h-4 w-4 mr-1">
                  {node.type === 'folder' ? (
                    <Folder className="h-4 w-4 text-gray-400" />
                  ) : (
                    <File className="h-4 w-4 text-gray-400" />
                  )}
                </div>
                <span 
                  className={`text-sm ${node.type === 'folder' ? 'font-semibold' : ''} text-gray-700 hover:text-gray-900 transition-colors duration-200 cursor-pointer`}
                  onClick={() => node.type === 'file' ? handleFileClick(node) : toggleFolder(node.id)}
                >
                  {node.name}
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
                            className="h-6 w-6 p-0 hover:bg-gray-200"
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
                            className="h-6 w-6 p-0 hover:bg-gray-200"
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
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                        onClick={() => deleteItem(node.id, node.name, node.type)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete</p>
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
    // Add confirmation dialog
    const confirmMessage = `Are you sure you want to delete this ${nodeType}${nodeType === 'folder' ? ' and all its contents' : ''}?`
    if (!confirm(confirmMessage)) {
      return
    }

    // Get the full path of the node
    const fullPath = getNodeFullPath(fileTree, nodeId)
    if (!fullPath) {
      console.error('Could not find full path for node')
      return
    }

    try {
      const response = await fetch('/api/files', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: fullPath,  // Use the full path instead of just the node name
          type: nodeType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      // Update the file tree by filtering out the deleted item
      const updatedTree = deleteItemFromTree(fileTree, nodeId);
      setFileTree(updatedTree);

    } catch (error) {
      console.error('Error deleting item:', error);
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
