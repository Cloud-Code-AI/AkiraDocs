'use client'

import { useState, useEffect, useRef, useMemo, memo } from 'react'
import { getTranslation, locales } from '@/lib/staticTranslation'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from 'next/navigation'
import { HeaderConfig } from '@/types/config'
import { searchContent, type SearchResult } from '@/lib/search'
import { useDebounce } from '@/hooks/useDebounce'
import { useClickOutside } from '@/hooks/useClickOutside'
import { useAnalytics } from '@/hooks/useAnalytics'

export const Header = memo(function Header({
  logo,
  title,
  showSearch = true,
  searchPlaceholder,
  navItems,
  socialLinks,
  languages,
  currentLocale = 'en',
  currentType = 'docs'
}: HeaderConfig) {
  const [isMounted, setIsMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { track } = useAnalytics()
  const t = getTranslation(currentLocale as keyof typeof locales);

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const toggleTheme = () => {
    if (isMounted) {
      setTheme(theme === "light" ? "dark" : "light")
    }
  }

  const handleLanguageChange = (value: string) => {
    console.debug('Language change requested:', value);
    const currentPath = window.location.pathname;
    track('language_switch', {
      from_language: currentLocale,
      to_language: value,
      page_path: currentPath
    })
    const newPath = currentPath.replace(/^\/[a-z]{2}/, `/${value}`);
    console.debug('Redirecting to:', newPath);
    router.push(newPath);

  }

  const debouncedSearch = useDebounce((query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowResults(false)
      return
    }
    const results = searchContent(query).map(result => ({
      ...result,
      path: `/${currentLocale}${result.path}`
    }))
    setSearchResults(results)
    setShowResults(true)
  }, 300)

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    debouncedSearch(query)
  }

  useClickOutside(searchRef, () => setShowResults(false))

  // Memoize the selected locale display
  const selectedLocaleDisplay = useMemo(() => {
    const selectedLocale = languages?.locales.find(l => l.code === currentLocale)
    return selectedLocale ? (
      <>
        {selectedLocale.flag}&nbsp;{selectedLocale.name}
      </>
    ) : null
  }, [languages?.locales, currentLocale])

  // Memoize the navigation items
  const navigationItems = useMemo(() => {
    return navItems?.filter((item) => item.show).map((item, index) => {
      // Check if the current nav item matches the page type
      const isActive = currentType ? item.href.includes(`/${currentType}`) : pathname === item.href;
      
      return (
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
            ${isActive
                ? 'text-foreground bg-muted'
                : 'text-muted-foreground hover:text-foreground'
              }`}
          >
            {t(item.label as string)}
            <span
              className={`absolute inset-x-0 -bottom-px h-0.5 bg-primary transition-transform duration-150 ease-in-out
              ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
            />
          </Link>
        </motion.div>
      );
    });
  }, [navItems, pathname, currentType]);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full bg-background/95 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {logo?.show && (
              <Link href="/">
                <motion.div
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="relative">
                    <div className="absolute rounded-full"></div>
                    <IconSVG
                      src={logo.path}
                      alt={`${title} logo`}
                      width={logo.width}
                      height={logo.height}
                      className="relative rounded-full"
                    />
                  </div>
                </motion.div>
              </Link>
            )}
            
            {(!logo?.show && title) && (
              <h1 className="text-xl font-bold text-foreground">
                {title}
              </h1>
            )}

            {languages && languages.locales.length > 1 && (
              <Select
                value={currentLocale}
                onValueChange={handleLanguageChange}
              >
                <SelectTrigger className="w-[140px] h-8 text-sm">
                  <SelectValue>
                    {selectedLocaleDisplay}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {languages.locales.map((locale) => (
                    <SelectItem
                      key={locale.code}
                      value={locale.code}
                      className="text-sm"
                    >
                      {locale.flag}&nbsp;{locale.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {navItems && (
            <nav className="hidden md:flex space-x-2">
              <AnimatePresence>
                {navigationItems}
              </AnimatePresence>
            </nav>
          )}

          <div className="flex items-center space-x-4">
            {showSearch && (
              <div className="relative hidden md:block" ref={searchRef}>
                <Input
                  type="search"
                  placeholder={t('common.labels.search')}
                  className="w-64 pr-8 rounded-md"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim()) setShowResults(true)
                  }}
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                
                {showResults && (
                  <div className="absolute top-full mt-2 w-full bg-background border rounded-md shadow-lg overflow-hidden z-50">
                    {searchResults.length > 0 ? (
                      searchResults.map((result, index) => (
                        <Link
                          key={index}
                          href={result.path}
                          onClick={() => {
                            track('search_result_click', {
                              result_path: result.path,
                              result_title: result.title,
                              result_type: result.type
                            })
                            setShowResults(false)
                            setSearchQuery('')
                          }}
                          className="block px-4 py-2 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{result.title}</span>
                            <span className="text-xs text-muted-foreground capitalize px-2 py-1 bg-muted rounded">
                              {result.type}
                            </span>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-muted-foreground">
                        No matching results found
                      </div>
                    )}
                  </div>
                )}
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
                          {t(item.label as string)}
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
                      <Input 
                        type="search" 
                        placeholder={searchPlaceholder} 
                        className="w-full rounded-full bg-muted/50 focus:bg-background transition-colors" 
                      />
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
})