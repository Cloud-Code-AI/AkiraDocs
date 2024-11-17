"use client"
import { Sparkles, ArrowLeft } from "lucide-react"
import { Button } from "@/elements/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/elements/card"
import { Separator } from "@/elements/separator"
import { motion } from "framer-motion"
import { AIResponseActions } from "./AIResponseActions"
import { AIResponseSources } from "./AIResponseSources"
import type { AIResponseProps } from "akiradocs-types"

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
            <p>{response}</p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start space-y-4">
          <AIResponseActions />
          <Separator className="my-4" />
          <AIResponseSources sources={[]} />
        </CardFooter>
      </Card>
    </motion.div>
  )
}