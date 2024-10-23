'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, Search, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface NavItem {
  label: string;
  href: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string; // Path to PNG file
}

interface HeaderProps {
  logo?: string;
  title?: string;
  navItems?: NavItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  socialLinks?: SocialLink[];
  showAIToggle?: boolean;
  onAIToggle?: (enabled: boolean) => void;
  customSearchComponent?: React.ReactNode;
}

export function Header({
  logo = '/cloudcode_logo.png',
  title = 'AkiraDocs',
  navItems,
  showSearch = true,
  searchPlaceholder = 'Search...',
  socialLinks,
  showAIToggle = true,
  onAIToggle,
  customSearchComponent,
}: HeaderProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [showAI, setShowAI] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTheme = () => {
    if (isMounted) {
      setTheme(theme === "light" ? "dark" : "light")
    }
  }

  const handleAIToggle = (checked: boolean) => {
    setShowAI(checked)
    if (onAIToggle) {
      onAIToggle(checked)
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
          
          {navItems && (
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
          )}
          
          <div className="flex items-center space-x-4">
            {showSearch && (
              customSearchComponent || (
                <div className="relative hidden md:block">
                  <Input 
                    type="search" 
                    placeholder={searchPlaceholder}
                    className="w-64 pr-8"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              )
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-muted">
              {isMounted && theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            {socialLinks && socialLinks.map((link, index) => (
              <Button key={index} variant="ghost" size="icon" asChild className="rounded-full hover:bg-muted hidden md:flex">
                <Link href={link.url}>
                  <Image 
                    src={link.icon} 
                    alt={link.name} 
                    width={20} 
                    height={20}
                  />
                  <span className="sr-only">{link.name}</span>
                </Link>
              </Button>
            ))}
            {navItems && (
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
                  {showSearch && !customSearchComponent && (
                    <div className="mt-4">
                      <Input type="search" placeholder={searchPlaceholder} className="w-full rounded-full bg-muted/50 focus:bg-background transition-colors" />
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            )}
            {showAIToggle && (
              <div className="flex items-center space-x-2">
                <Switch
                  id="show-ai"
                  checked={showAI}
                  onCheckedChange={handleAIToggle}
                  className="data-[state=checked]:bg-indigo-600"
                />
                <Label
                  htmlFor="show-ai"
                  className="text-sm font-medium text-muted-foreground flex items-center cursor-pointer"
                >
                  <Sparkles className="h-5 w-5 mr-1 text-indigo-600 dark:text-indigo-400" />
                  AI View
                </Label>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}