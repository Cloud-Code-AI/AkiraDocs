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
import { ChatCompletionMessageParam, CreateMLCEngine } from "@mlc-ai/web-llm";
import { Source } from '@/types/Source'
import AILoader from '@/components/aiSearch/AILoader'

export default function Home() {
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recommendedArticles = getRecommendedArticles()
  const searchConfig = getSearchConfig()
  const config = getAkiradocsConfig()
  const [sources, setSources] = useState<Source[]>([])

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

  const extractSources = (response: string): { cleanResponse: string, sources: Source[] } => {
    // Split the response into parts
    const parts = response.split('Sources:');
    if (parts.length < 2) {
      return { cleanResponse: response, sources: [] };
    }

    const cleanResponse = parts[0].trim();
    const sourcesText = parts[1].trim();

    // Extract sources from the text
    const sources: Source[] = sourcesText
      .split('\n')
      .filter(line => line.trim().length > 0 && line.includes('.json')) // Only process non-empty lines containing .json
      .map(line => ({
        title: line.trim().split('/').pop()?.replace('.json', '') || '', // Get the filename without extension
        url: line.trim()
      }));

    return { cleanResponse, sources };
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setSources([]) // Reset sources
    
    try {
      const startEngineTime = performance.now();
      
      const contextResponse = await fetch('/context/en_docs.txt');
      if (!contextResponse.ok) {
        throw new Error(`Failed to fetch context: ${contextResponse.status}`);
      }
      const contextData = await contextResponse.text();
      const docsContext = contextData;

      // Initialize MLC Engine
      const engine = await CreateMLCEngine(
        "Llama-3.2-1B-Instruct-q4f16_1-MLC",
        { 
          initProgressCallback: (progress: any) => console.log(progress) 
        },
        {
          context_window_size: 100000,
        }
      );
      
      const engineLoadTime = performance.now() - startEngineTime;
      console.log(`Engine initialization took: ${engineLoadTime.toFixed(2)}ms`);

      // Prepare messages for the chat with context
      const messages = [
        { 
            role: "system", 
            content: `You are a technical documentation assistant specialized in providing accurate, concise answers based on the official documentation. 
            Your responses should be:
            1. Direct and to the point
            2. Based strictly on the provided documentation context
            3. Include relevant code examples when available
            4. Written in a technical but clear style
    
            Documentation context: ${docsContext}`
        },
        { 
            role: "user", 
            content: `Answer the following question using only the provided documentation context. 
            Question: ${query}
            Requirements for your response:
            1. If the answer isn't clearly supported by the documentation and you cant find relevant information in the documentation, say \"I don't have enough information to answer this question accurately.\"
            2. Strictly adhere to the documentation context; do not make assumptions or provide additional commentary.
            3. Include short code snippets if relevant.
            4. Only answer questions related to the Documentation Context.
            5. Be concise and to the point.
            After your answer, if you used any sources from the documentation, list them in this format:
            -------------
            Sources:
             - <title> (<path>)
             Example: 
             Sources:
              - Welcome to Akira Docs (articles/welcome.json)`
        }
    ];
    

      console.log(messages)

      const startChatTime = performance.now();
      // Get response from MLC chatbot
      const reply = await engine.chat.completions.create({ messages: messages as ChatCompletionMessageParam[] });
      const chatCompletionTime = performance.now() - startChatTime;
      console.log(`Chat completion took: ${chatCompletionTime.toFixed(2)}ms`);
      
      const aiContent = reply.choices[0].message.content || '';
      console.log("Response aiContent", aiContent)
      // Extract sources and clean response
      const { cleanResponse, sources } = extractSources(aiContent);
      
      setAiResponse(cleanResponse);
      setSources(sources);
      
    } catch (error) {
      console.error('Error during AI search:', error);
      
      // Check for WebGPU error
      if (error instanceof Error && error.name === 'WebGPUNotAvailableError') {
        setError('WebGPU is not yet supported on this browser. Please try using another browser.');
      } else {
        setError('Sorry, there was an error processing your request.');
      }
      setAiResponse('');
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    setAiResponse('')
  }

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
          {isLoading ? (
            <div className="flex flex-col justify-center items-center space-y-4 py-12">
              <AILoader />
              <p className="text-muted-foreground text-sm animate-pulse">
                Loading AI response...
              </p>
            </div>
          ) : error ? (
            <div className="text-center p-4 rounded-lg bg-red-50 text-red-800">
              <p className="text-lg font-medium mb-2">Error</p>
              <p>{error}</p>
            </div>
          ) : aiResponse ? (
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
