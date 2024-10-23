'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

type NavItem = {
  title: string;
  path?: string;
  badge?: string;
  items?: Record<string, NavItem>;
};

interface NavigationSidebarProps {
  items: Record<string, NavItem>;
}

const Navigation: React.FC<NavigationSidebarProps> = ({ items }) => {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-background/80 backdrop-blur-xl border-r h-[calc(100vh-4rem)] sticky top-16 shadow-sm">
      <ScrollArea className="h-full py-6 px-4">
        <nav>
          {Object.entries(items).map(([key, item]) => (
            <NavItem key={key} item={item} pathname={pathname} />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  )
}

interface NavItemProps {
  item: NavItem;
  pathname: string;
  depth?: number;
}

const NavItem: React.FC<NavItemProps> = ({ item, pathname, depth = 0 }) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.items && Object.keys(item.items).length > 0
  const isActive = item.path ? pathname === item.path : pathname.startsWith(item.path || '')

  return (
    <motion.div 
      className={cn("mb-1", `ml-${depth * 4}`)}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start text-left font-normal hover:bg-muted/50 transition-all",
          isActive && "bg-primary/10 text-primary font-medium",
          "rounded-lg"
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          <motion.div
            initial={false}
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="mr-2 h-4 w-4" />
          </motion.div>
        ) : (
          <FileText className="mr-2 h-4 w-4" />
        )}
        {item.path ? (
          <Link href={item.path} className="flex-1">
            {item.title}
          </Link>
        ) : (
          <span className="flex-1">{item.title}</span>
        )}
        {item.badge && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {item.badge}
          </span>
        )}
      </Button>
      <AnimatePresence initial={false}>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {Object.entries(item.items!).map(([key, child]) => (
              <NavItem key={key} item={child} pathname={pathname} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default Navigation
