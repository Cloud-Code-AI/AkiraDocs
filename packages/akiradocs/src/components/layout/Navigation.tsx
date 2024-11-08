'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, FileText } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { NavigationProps, NavItemProps } from "@/types/navigation"
import { ErrorBoundary } from 'react-error-boundary'

const buttonStyles = {
  base: "w-full justify-start text-left font-normal rounded-lg transition-colors",
  hover: "hover:bg-accent hover:text-accent-foreground",
  active: "bg-accent/50 text-accent-foreground font-medium",
  state: "data-[state=open]:bg-accent/50",
}

function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="w-64 p-4 text-sm text-red-500">
      <h2 className="font-semibold">Navigation Error</h2>
      <p>Something went wrong loading the navigation.</p>
    </div>
  )
}

export function Navigation({ locale, items }: NavigationProps) {
  const pathname = usePathname()
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <aside className="w-64 bg-sidebar-background text-sidebar-foreground border-r h-[calc(100vh-4rem)] sticky top-16 shadow-sm">
        <ScrollArea className="h-full py-6 px-4">
          <nav>
            {Object.entries(items).map(([key, item]) => (
              <NavItem key={key} locale={locale} item={item} pathname={pathname} />
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </ErrorBoundary>
  )
}

const NavItem = React.memo(({ locale, item, pathname, depth = 0 }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = item.items && Object.keys(item.items).length > 0
  const isActive = item.path ? pathname === `/${locale}${item.path}` : false
  const absolutePath = item.path ? `/${locale}${item.path}` : '#'

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (item.path && pathname === `/${locale}${item.path}`) {
      e.preventDefault()
    }
    if (hasChildren) {
      setIsOpen(prev => !prev)
    }
  }, [hasChildren, item.path, locale, pathname])

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
          buttonStyles.base,
          buttonStyles.hover,
          buttonStyles.state,
          isActive && buttonStyles.active,
        )}
        onClick={handleClick}
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
          <Link href={absolutePath} className="flex-1" onClick={handleClick}>
            {item.title}
          </Link>
        ) : (
          <span className="flex-1">{item.title}</span>
        )}
        {item.badge && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-accent text-accent-foreground">
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
              <NavItem locale={locale} key={key} item={child} pathname={pathname} depth={depth + 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

NavItem.displayName = 'NavItem'

export default Navigation
