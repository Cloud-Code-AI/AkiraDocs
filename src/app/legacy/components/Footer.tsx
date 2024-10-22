'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin, Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background/80 backdrop-blur-xl border-t shadow-lg mt-auto"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-muted-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© {currentYear} Your Company. All rights reserved.</span>
              <span>|</span>
              <span>Made with <Heart className="inline-block w-4 h-4 text-red-500" /> by the Your Company team</span>
            </div>
            <div className="flex space-x-4">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" asChild className="rounded-full bg-muted/50 hover:bg-muted transition-colors">
                  <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" asChild className="rounded-full bg-muted/50 hover:bg-muted transition-colors">
                  <a href="https://twitter.com/your-account" target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="icon" asChild className="rounded-full bg-muted/50 hover:bg-muted transition-colors">
                  <a href="https://linkedin.com/company/your-company" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                  </a>
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer