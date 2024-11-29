"use client"

import { useState } from 'react'
import { SearchHeader } from '@/components/aiSearch/SearchHeader'
import { SearchBar } from '@/components/aiSearch/SearchBar'
import { LegacyDocsToggle } from '@/components/aiSearch/LegacyDocsToggle'
import { AIResponse } from '@/components/aiSearch/AIResponse'
import { RecommendedArticles } from '@/components/aiSearch/RecommendedArticles'
import { AnimatePresence } from 'framer-motion'
import { getRecommendedArticles } from '@/lib/recommendedArticles'
import { getSearchConfig } from '@/lib/searchConfig'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { getAkiradocsConfig } from '@/lib/getAkiradocsConfig'

export default function Home() {
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const recommendedArticles = getRecommendedArticles()
  const searchConfig = getSearchConfig()
  const config = getAkiradocsConfig()
  // If AI Search is disabled, show the disabled message
  if (!config.navigation.header.items.find((item: any) => item.href === '/aiSearch')?.show) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-3xl font-bold">AI Search is Disabled</h1>
          <p className="text-muted-foreground">
            AI Search is currently disabled. To enable this feature, set &quot;aiSearch&quot;: true in your configuration file.
          </p>
          <Button asChild>
            <Link href="/">Go to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setAiResponse('This is a placeholder AI response. Implement actual AI search here.')
  }

  const handleBack = () => {
    setAiResponse('')
  }

  const sources = [
    { title: 'AkiraDocs Official Documentation', url: 'https://docs.akiradocs.com' },
    { title: 'AI-Powered Documentation Best Practices', url: 'https://aibest.practices.com' },
  ]

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SearchHeader 
          logo={searchConfig.logo}
          title={searchConfig.title}
          description={searchConfig.description}
        />
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center items-center mb-12">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSubmit={handleSearch}
          />
          <LegacyDocsToggle/>
        </div>

        <AnimatePresence>
          {aiResponse ? (
            <AIResponse
              response={aiResponse}
              sources={sources}
              onBack={handleBack}
            />
          ) : recommendedArticles && (
            <RecommendedArticles articles={recommendedArticles} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
