'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface DocItem {
  title: string
  href: string
  subItems?: DocItem[]
}

interface DocSidebarProps {
  items?: DocItem[]
}

const dummyItems: DocItem[] = [
  {
    title: 'Getting Started',
    href: '/docs/getting-started',
    subItems: [
      { title: 'Installation', href: '/docs/getting-started/installation' },
      { title: 'Configuration', href: '/docs/getting-started/configuration' },
      { title: 'Project Structure', href: '/docs/getting-started/project-structure' },
    ],
  },
  {
    title: 'Core Concepts',
    href: '/docs/core-concepts',
    subItems: [
      { title: 'Routing', href: '/docs/core-concepts/routing' },
      { 
        title: 'Data Fetching', 
        href: '/docs/core-concepts/data-fetching',
        subItems: [
          { title: 'Server-side', href: '/docs/core-concepts/data-fetching/server-side' },
          { title: 'Client-side', href: '/docs/core-concepts/data-fetching/client-side' },
        ]
      },
      { title: 'Rendering', href: '/docs/core-concepts/rendering' },
      { title: 'State Management', href: '/docs/core-concepts/state-management' },
    ],
  },
  { title: 'Components', href: '/docs/components' },
  {
    title: 'API Reference',
    href: '/docs/api-reference',
    subItems: [
      { title: 'Functions', href: '/docs/api-reference/functions' },
      { title: 'Hooks', href: '/docs/api-reference/hooks' },
      { title: 'Utilities', href: '/docs/api-reference/utilities' },
    ],
  },
  { title: 'Deployment', href: '/docs/deployment' },
  {
    title: 'Advanced Topics',
    href: '/docs/advanced-topics',
    subItems: [
      { title: 'Performance Optimization', href: '/docs/advanced-topics/performance-optimization' },
      { title: 'Security', href: '/docs/advanced-topics/security' },
      { title: 'Testing', href: '/docs/advanced-topics/testing' },
    ],
  },
]

const DocSidebar: React.FC<DocSidebarProps> = ({ items = dummyItems }) => {
  const pathname = usePathname()

  const renderItems = (items: DocItem[], depth = 0) => {
    return items.map((item) => (
      <motion.div 
        key={item.href} 
        className={cn("mb-1", depth > 0 && "ml-4")}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        {item.subItems && item.subItems.length > 0 ? (
          <ExpandableItem item={item} depth={depth} />
        ) : (
          <Link href={item.href} passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-normal hover:bg-muted/50 transition-all",
                pathname === item.href && "bg-primary/10 text-primary font-medium",
                "rounded-lg"
              )}
            >
              <FileText className="mr-2 h-4 w-4" />
              {item.title}
            </Button>
          </Link>
        )}
      </motion.div>
    ))
  }

  return (
    <aside className="w-64 bg-background/80 backdrop-blur-xl border-r h-[calc(100vh-4rem)] sticky top-16 shadow-sm">
      <ScrollArea className="h-full py-6 px-4">
        <nav>{renderItems(items)}</nav>
      </ScrollArea>
    </aside>
  )
}

const ExpandableItem: React.FC<{ item: DocItem; depth: number }> = ({ item, depth }) => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = pathname.startsWith(item.href)

  return (
    <>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left font-normal hover:bg-muted/50 transition-all",
          isActive && "bg-primary/10 text-primary font-medium",
          "rounded-lg"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight className="mr-2 h-4 w-4" />
        </motion.div>
        {item.title}
      </Button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {item.subItems && renderItems(item.subItems, depth + 1)}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default DocSidebar