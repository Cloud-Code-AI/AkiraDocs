"use client"
import { Sparkles, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { AIResponseActions } from "./AIResponseActions"
import { AIResponseSources } from "./AIResponseSources"
import ReactMarkdown from 'react-markdown'
import { Source } from "@/types/Source"

interface AIResponseProps {
  response: string
  sources: Source[]
  onBack: () => void
}

export function AIResponse({ response, sources, onBack }: AIResponseProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="mt-8 shadow-lg border-border">
        <CardHeader className="bg-accent/50 flex flex-row items-center justify-between">
          <CardTitle className="flex items-center text-2xl text-primary">
            <Sparkles className="mr-2 h-6 w-6" />
            AI Guide
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onBack} className="text-primary hover:text-primary/80">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </CardHeader>
        <CardContent className="pt-6">
        <div className="prose dark:prose-invert max-w-none">
            <ReactMarkdown>{response}</ReactMarkdown>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <AIResponseActions response={response} />
          <Separator className="my-4" />
          <AIResponseSources sources={sources} />
        </CardFooter>
      </Card>
    </motion.div>
  )
}