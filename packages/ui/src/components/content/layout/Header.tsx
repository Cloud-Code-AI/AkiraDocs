'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
// import Image from 'next/image'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import IconSVG from '@/components/ui/iconSVG'

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

interface HeaderProps {
  logo?: {
    path: string;
    width: number;
    height: number;
  };
  title?: {
    text: string;
    show: boolean;
  };
  navItems?: NavItem[];
  showSearch?: boolean;
  searchPlaceholder?: string;
  socialLinks?: SocialLink[];
}

export function Header({
  logo = {
    path: '/akiradocs_logo.svg',
    width: 120,
    height: 30
  },
  title = {
    text: '',
    show: false
  },
  navItems,
  showSearch = true,
  searchPlaceholder = 'Search...',
  socialLinks,
}: HeaderProps) {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()

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
              <IconSVG 
                src={logo.path} 
                alt={`${title.text} logo`}
                width={logo.width}
                height={logo.height}
                className="relative rounded-full" 
              />
            </div>
            {title.show && (
              <h1 className="text-xl font-bold text-foreground">{title.text}</h1>
            )}
          </motion.div>
          
          {navItems && (
            <nav className="hidden md:flex space-x-2">
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
                      className={`group relative flex items-center gap-x-2 text-sm font-medium transition-colors px-3 py-2 rounded-md
                        ${pathname === item.href 
                          ? 'text-foreground bg-muted' 
                          : 'text-muted-foreground hover:text-foreground'
                        }`}
                    >
                      {item.icon && (
                        <IconSVG 
                          src={item.icon} 
                          alt={`${item.label} icon`}
                          width={16}
                          height={16}
                          className="text-current" 
                        />
                      )}
                      {item.label}
                      <span 
                        className={`absolute inset-x-0 -bottom-px h-0.5 bg-primary transition-transform duration-150 ease-in-out
                          ${pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} 
                      />
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </nav>
          )}
          
          <div className="flex items-center space-x-4">
            {showSearch && (
              <div className="relative hidden md:block">
                <Input 
                  type="search" 
                  placeholder={searchPlaceholder}
                  className="w-64 pr-8 rounded-md"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full hover:bg-muted">
              {isMounted && theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            {socialLinks && socialLinks.map((link, index) => (
              <Button key={index} variant="ghost" size="icon" asChild className="rounded-full hover:bg-muted hidden md:flex">
                <Link href={link.url}>
                  {link.icon && (
                    <IconSVG 
                      src={link.icon} 
                      alt={`${link.name} icon`}
                      width={16}
                      height={16}
                      className="text-current" 
                    />
                  )}
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
                          className={`group relative flex items-center gap-x-2 transition-colors px-3 py-2 rounded-md
                            ${pathname === item.href 
                              ? 'text-foreground bg-muted' 
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                        >
                          {item.icon && (
                            <IconSVG 
                              src={item.icon} 
                              alt={`${item.label} icon`}
                              width={16}
                              height={16}
                              className="text-current" 
                            />
                          )}
                          {item.label}
                          <span 
                            className={`absolute inset-x-0 -bottom-px h-0.5 bg-primary transition-transform duration-150 ease-in-out
                              ${pathname === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} 
                          />
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                  {showSearch && (
                    <div className="mt-4">
                      <Input type="search" placeholder={searchPlaceholder} className="w-full rounded-full bg-muted/50 focus:bg-background transition-colors" />
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  )
}