'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, FileText } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "akiradocs-ui"
import { ScrollArea } from "akiradocs-ui"
import { NavigationProps, NavItemProps } from "@/types/navigation"
import { ErrorBoundary } from 'react-error-boundary'
import { getApiNavigation } from '@/lib/content';

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
            {Object.entries(items)
              .filter(([key]) => key !== "defaultRoute")
              .map(([key, item]) => (
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

export function ApiSidebar() {
  const navigation = getApiNavigation();
  
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <aside className="w-64 bg-sidebar-background text-sidebar-foreground border-r h-[calc(100vh-4rem)] sticky top-16 shadow-sm">
        <ScrollArea className="h-full py-6 px-4">
          <nav>
            {navigation.map((item, index) => (
              <ApiNavItem key={index} item={item} />
            ))}
          </nav>
        </ScrollArea>
      </aside>
    </ErrorBoundary>
  );
}

const ApiNavItem = React.memo(({ item }: { item: any }) => {
  const methodClass = item.method.toLowerCase()
  const sectionId = `${methodClass}-${item.path}`

  const scrollToSection = useCallback((elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const headerOffset = 64 + 32
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }, [])

  // Define badge colors to match main content
  const methodColors = {
    get: 'bg-green-100 text-green-800',
    post: 'bg-blue-100 text-blue-800',
    put: 'bg-yellow-100 text-yellow-800',
    patch: 'bg-orange-100 text-orange-800',
    delete: 'bg-red-100 text-red-800',
  }

  return (
    <motion.div 
      className="mb-1"
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
        )}
        onClick={() => scrollToSection(sectionId)}
      >
        <div className="flex-1">
          <span className={`mr-2 px-2 py-1 text-xs font-medium rounded-md ${methodColors[methodClass] || 'bg-gray-100 text-gray-800'}`}>
            {item.method.toUpperCase()}
          </span>
          {item.title}
        </div>
      </Button>
    </motion.div>
  )
})

ApiNavItem.displayName = 'ApiNavItem'

export default Navigation
