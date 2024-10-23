"use client"
import { motion } from "framer-motion"

export function SearchHeader() {
  return (
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
    </motion.div>
  )
}