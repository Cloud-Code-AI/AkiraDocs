'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, Github, Twitter, Linkedin, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  logo?: string
  title?: string
  navItems?: { label: string; href: string }[]
  showSearch?: boolean
  socialLinks?: {
    github?: string
    twitter?: string
    linkedin?: string
  }
}

export function HeaderComponent({
  logo = '/cloudcode_logo.png',
  title = 'Documentation Template',
  navItems = [
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'API', href: '/api' },
    { label: 'Blog', href: '/blog' },
  ],
  showSearch = true,
  socialLinks = {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com',
  }
}: HeaderProps = {}) {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTheme = () => {
    if (isMounted) {
      setTheme(theme === "light" ? "dark" : "light")
    }
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full bg-background/95 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-4"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <div className="absolute rounded-full"></div>
              <Image src={logo} alt={`${title} logo`} width={30} height={30} className="relative rounded-full" />
            </div>
            <h1 className="text-xl font-bold text-foreground">{title}</h1>
          </motion.div>
          
          <nav className="hidden md:flex space-x-1">
            <AnimatePresence>
              {navItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </nav>
          
          <div className="flex items-center space-x-4">
            {showSearch && (
              <div className="relative hidden md:block">
                <Input 
                  type="search" 
                  placeholder="Search documentation..." 
                  className="w-64 pr-8"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-muted">
              {isMounted && theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            {Object.entries(socialLinks).map(([key, value]) => (
              <Button key={key} variant="ghost" size="icon" asChild className="rounded-full hover:bg-muted hidden md:flex">
                <Link href={value}>
                  {key === 'github' && <Github className="h-5 w-5" />}
                  {key === 'twitter' && <Twitter className="h-5 w-5" />}
                  {key === 'linkedin' && <Linkedin className="h-5 w-5" />}
                  <span className="sr-only">{key}</span>
                </Link>
              </Button>
            ))}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden rounded-full hover:bg-muted">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4 mt-4">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link 
                        href={item.href}
                        className="text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-muted block"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
                {showSearch && (
                  <div className="mt-4">
                    <Input type="search" placeholder="Search documentation..." className="w-full rounded-full bg-muted/50 focus:bg-background transition-colors" />
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  )
}
