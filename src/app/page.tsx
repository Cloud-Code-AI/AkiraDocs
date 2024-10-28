"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchHeader } from '@/components/content/aiSearch/SearchHeader'
import { SearchBar } from '@/components/content/aiSearch/SearchBar'
import { LegacyDocsToggle } from '@/components/content/aiSearch/LegacyDocsToggle'
import { AIResponse } from '@/components/content/aiSearch/AIResponse'
import { RecommendedArticles } from '@/components/content/aiSearch/RecommendedArticles'
import { AnimatePresence } from 'framer-motion'
import { getRecommendedArticles } from '@/lib/recommendedArticles'


export default function Home() {
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const recommendedArticles = getRecommendedArticles()
  const router = useRouter()

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <SearchHeader />
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center items-center mb-12">
          <SearchBar
            query={query}
            onQueryChange={setQuery}
            onSubmit={handleSearch}
          />
          <LegacyDocsToggle />
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
