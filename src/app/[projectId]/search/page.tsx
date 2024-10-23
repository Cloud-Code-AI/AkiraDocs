"use client"
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { SearchHeader } from '@/components/content/search/SearchHeader'
import { SearchBar } from '@/components/content/search/SearchBar'
import { LegacyDocsToggle } from '@/components/content/search/LegacyDocsToggle'
import { AIResponse } from '@/components/content/search/AIResponse'
import { RecommendedArticles } from '@/components/content/search/RecommendedArticles'
import { AnimatePresence } from 'framer-motion'
import { Article } from '@/types/Article' // Adjust the import path as needed

export default function DocSearch() {
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [showTraditionalDocs, setShowTraditionalDocs] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setAiResponse('This is a placeholder AI response. Implement actual AI search here.')
  }

  const handleBack = () => {
    setAiResponse('')
  }

  const handleToggleChange = (checked: boolean) => {
    setShowTraditionalDocs(checked)
    if (checked) {
      router.push('/legacy')
    }
  }

  const recommendedArticles: Article[] = [
    { id: '1', title: 'Getting Started with AkiraDocs', description: 'Learn the basics of using AkiraDocs for your project.', content: '', author: '', publishDate: new Date() },
    { id: '2', title: 'Advanced Search Techniques', description: 'Master the art of efficient document searching.', content: '', author: '', publishDate: new Date() },
    { id: '3', title: 'Integrating AkiraDocs with Your Workflow', description: 'Seamlessly incorporate AkiraDocs into your development process.', content: '', author: '', publishDate: new Date() },
  ]

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
          <LegacyDocsToggle
            checked={showTraditionalDocs}
            onCheckedChange={handleToggleChange}
          />
        </div>

        <AnimatePresence>
          {aiResponse ? (
            <AIResponse
              response={aiResponse}
              sources={sources}
              onBack={handleBack}
            />
          ) : (
            <RecommendedArticles articles={recommendedArticles} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
