"use client"

import React, { useState } from 'react'
import { Search, Sparkles, ChevronRight, BookOpen, ThumbsUp, ThumbsDown, Copy, Share, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { motion, AnimatePresence } from "framer-motion"

export function DocSearchComponent() {
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [showTraditionalDocs, setShowTraditionalDocs] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setAiResponse('This is a placeholder AI response. Implement actual AI search here.')
  }

  const handleBack = () => {
    setAiResponse('')
  }

  const recommendedArticles = [
    { title: 'Getting Started with AkiraDocs', description: 'Learn the basics of using AkiraDocs for your project.' },
    { title: 'Advanced Search Techniques', description: 'Master the art of efficient document searching.' },
    { title: 'Integrating AkiraDocs with Your Workflow', description: 'Seamlessly incorporate AkiraDocs into your development process.' },
  ]

  const sources = [
    { title: 'AkiraDocs Official Documentation', url: 'https://docs.akiradocs.com' },
    { title: 'AI-Powered Documentation Best Practices', url: 'https://aibest.practices.com' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
            AkiraDocs
          </h1>
          <p className="text-xl text-muted-foreground mb-8">Next-gen documentation powered by AI</p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center items-center">
            <form onSubmit={handleSearch} className="flex-1 max-w-2xl w-full">
              <div className="relative flex items-center">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="What do you want to learn?"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-12 pr-20 py-6 w-full text-lg rounded-full focus-visible:ring-2 focus-visible:ring-indigo-500 shadow-lg"
                />
                <Button 
                  type="submit" 
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </form>
            <div className="flex items-center space-x-2">
              <Switch
                id="show-docs"
                checked={showTraditionalDocs}
                onCheckedChange={setShowTraditionalDocs}
                className="data-[state=checked]:bg-indigo-600"
              />
              <Label
                htmlFor="show-docs"
                className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center cursor-pointer"
              >
                <BookOpen className="h-5 w-5 mr-1 text-indigo-600 dark:text-indigo-400" />
                Legacy Docs
              </Label>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {aiResponse && (
            <motion.div
              key="ai-response"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="mt-8 shadow-lg border-indigo-200 dark:border-indigo-800">
                <CardHeader className="bg-indigo-50 dark:bg-indigo-900/50 flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center text-2xl text-indigo-700 dark:text-indigo-300">
                    <Sparkles className="mr-2 h-6 w-6" />
                    AI Guide
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={handleBack} className="text-indigo-600 dark:text-indigo-400">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{aiResponse}</p>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col items-start space-y-4">
                  <div className="flex items-center space-x-4 w-full">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <ThumbsUp className="mr-2 h-4 w-4" />
                        Helpful
                      </Button>
                      <Button variant="outline" size="sm">
                        <ThumbsDown className="mr-2 h-4 w-4" />
                        Not Helpful
                      </Button>
                    </div>
                    <div className="flex-grow"></div>
                    <Button variant="ghost" size="sm">
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>
                  <Separator className="my-4" />
                  <div className="w-full">
                    <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">Sources</h4>
                    <ul className="space-y-1">
                      {sources.map((source, index) => (
                        <li key={index}>
                          <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                            {source.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {!aiResponse && !showTraditionalDocs && (
            <motion.div
              key="recommended-articles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-800 dark:text-indigo-200">Recommended Articles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedArticles.map((article, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="h-full shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border-indigo-100 dark:border-indigo-800">
                      <CardHeader>
                        <CardTitle className="text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                          {article.title}
                        </CardTitle>
                        <CardDescription>{article.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow"></CardContent>
                      <CardContent className="pt-0">
                        <Button variant="link" className="p-0 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200">
                          Read More <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {showTraditionalDocs && (
            <motion.div
              key="traditional-docs"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="mt-12"
            >
              <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-800 dark:text-indigo-200">Traditional Documentation</h2>
              <Card className="prose dark:prose-invert max-w-none shadow-lg border-indigo-200 dark:border-indigo-800">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">Introduction</h3>
                  <p>Welcome to AkiraDocs. This guide will help you understand and integrate our services into your applications.</p>
                  <h3 className="text-2xl font-semibold mb-4 mt-8 text-indigo-700 dark:text-indigo-300">Getting Started</h3>
                  <p>To use AkiraDocs, you'll need to set up your environment and understand the basic concepts.</p>
                  <h3 className="text-2xl font-semibold mb-4 mt-8 text-indigo-700 dark:text-indigo-300">Features</h3>
                  <p>AkiraDocs provides several features for efficient documentation management and searching. Each feature is explained in detail in our comprehensive guide.</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}