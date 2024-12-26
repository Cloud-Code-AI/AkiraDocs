"use client"

import { useState, useCallback } from 'react'
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
import { getHeaderConfig } from '@/lib/headerConfig'
import { Header } from '@/components/layout/Header'
import { generateEmbedding } from '@/lib/aisearch/embeddings'
import { getDbWorker } from '@/lib/aisearch/dbWorker'

function cosineSimilarity(a: number[], b: number[]): number {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    return dotProduct / (magnitudeA * magnitudeB);
}

export default function Home() {
    const [query, setQuery] = useState('')
    const [aiResponse, setAiResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const recommendedArticles = getRecommendedArticles()
    const searchConfig = getSearchConfig()
    const headerConfig = getHeaderConfig()
    const config = getAkiradocsConfig()
    const [sources, setSources] = useState<Source[]>([])
    const [result, setResult] = useState<number[]>([])
    const handleGenerateEmbedding = useCallback(async (text: string) => {
        try {
            setIsLoading(true);
            console.log("Loading model for embedding");
            const embedding = await generateEmbedding(text, (progress) => {
                console.log(`Progress: ${progress.progress}%`);
            });
            return embedding;
        } catch (error) {
            console.error('Error generating embedding:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    }, []);

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
        setSources([])
        
        const startTime = performance.now()
        
        try {
            // Generate embedding for the query
            const embeddings = await handleGenerateEmbedding(query);

            // Get database worker
            const worker = await getDbWorker();

            // SQL query for similarity search
            const similarityQuery = `
                WITH similarity AS (
                    SELECT 
                        path,
                        content,
                        (
                            WITH RECURSIVE
                                embedding_values(value, rest) AS (
                                    SELECT '', json($embedding) || ',' 
                                    UNION ALL
                                    SELECT 
                                        substr(rest, 0, instr(rest, ',')),
                                        substr(rest, instr(rest, ',') + 1)
                                    FROM embedding_values 
                                    WHERE rest <> ''
                                ),
                                doc_values(value, rest) AS (
                                    SELECT '', embedding || ',' 
                                    UNION ALL
                                    SELECT 
                                        substr(rest, 0, instr(rest, ',')),
                                        substr(rest, instr(rest, ',') + 1)
                                    FROM doc_values 
                                    WHERE rest <> ''
                                )
                            SELECT 
                                SUM(CAST(ev.value AS FLOAT) * CAST(dv.value AS FLOAT)) /
                                (SQRT(SUM(CAST(ev.value AS FLOAT) * CAST(ev.value AS FLOAT))) * 
                                 SQRT(SUM(CAST(dv.value AS FLOAT) * CAST(dv.value AS FLOAT))))
                            FROM embedding_values ev
                            JOIN doc_values dv ON 1=1
                            WHERE ev.value <> '' AND dv.value <> ''
                        ) as similarity_score
                    FROM documents
                    WHERE embedding IS NOT NULL
                )
                SELECT path, content, similarity_score
                FROM similarity
                WHERE similarity_score > 0
                ORDER BY similarity_score DESC
                LIMIT 5
            `;

            // const similarityQuery = `
            //     SELECT *
            //     FROM documents
            //     WHERE embedding IS NOT NULL
            //     LIMIT 5
            // `;

            const results = await worker.db.query(
                similarityQuery
            );

            console.log("RAG top 5 results:", results)

            // Combine relevant documents into context
            const docsContext = results
                .map((doc: any) => `
                    Source: ${doc.path}
                    ${doc.content}
                    ---
                `)
                .join('\n');

            const engine = await CreateMLCEngine(
                "Llama-3.2-1B-Instruct-q4f16_1-MLC",
                { initProgressCallback: (progress: any) => console.log(progress) },
                {
                    context_window_size: 20000,
                }
            );

            const engineLoadTime = performance.now() // Track engine load time
            console.log(`Time taken for engine initialization: ${(engineLoadTime - startTime) / 1000}s`)

            const messages = [
              {
                  role: "system",
                  content: `You are a technical documentation assistant. Answer questions accurately and concisely using only the provided documentation. Include code examples if available.`
              },
              {
                  role: "user",
                  content: `
                  Can you answer in short and concise manner to user based on documentation provided.
          
          Question: ${query}
          
          Answer the question using only the provided documentation. 
          
          If the answer isn't in the documentation, say: "I cannot answer this question from the given documentation."
          
          Do not make assumptions or add information not in the documentation.
          
          If relevant, include short code snippets.

          Ensure the final output is in markdown format.
          
          Sources (if used):
          - <title> (<path>)
          
          Documentation: ${docsContext}
          `
              }
          ];

            console.log("Messages:", messages)

            const chunks = await engine.chat.completions.create({ 
                messages: messages as ChatCompletionMessageParam[],
                stream: true,
                stream_options: { include_usage: true },
                max_tokens: 1000,
                temperature: 0.3,
                top_p: 0.9,
                frequency_penalty: 0.5,
                presence_penalty: 0.5,
            });

            let aiContent = "";
            for await (const chunk of chunks) {
                const newContent = chunk.choices[0]?.delta.content || "";
                aiContent += newContent;
                setAiResponse(aiContent);
            }

            const endTime = performance.now() // Track total time
            console.log(`Total time taken for AI search: ${(endTime - startTime) / 1000}s`)

            // Extract sources after the full response is received
            const { cleanResponse, sources } = extractSources(aiContent);
            setAiResponse(cleanResponse);
            setSources(sources);
            
        } catch (error) {
            console.error('Search error:', error);
            setError(error instanceof Error ? error.message : 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    }

    const handleBack = () => {
        setAiResponse('')
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header {...headerConfig} currentLocale={`en`} currentType={`aiSearch`}/>
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
        </div>
    )
}
