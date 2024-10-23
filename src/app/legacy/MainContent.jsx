'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactDOMServer from 'react-dom/server';
import { Copy, Check } from 'lucide-react'

const MainContent = ({ content }) => {
  const [showScrollToTop, setShowScrollToTop] = useState(false)
  const [parsedContent, setParsedContent] = useState(content);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 300)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const renderContent = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      
      const applyStyles = (element) => {
        if (element.tagName === 'H1') {
          element.className = 'text-4xl font-bold mb-6 mt-10';
        } else if (element.tagName === 'H2') {
          element.className = 'text-3xl font-semibold mb-4 mt-8 border-b pb-2';
        } else if (element.tagName === 'H3') {
          element.className = 'text-2xl font-semibold mb-3 mt-6';
        } else if (element.tagName === 'P') {
          element.className = 'mb-4';
        } else if (element.tagName === 'UL' || element.tagName === 'OL') {
          element.className = 'mb-4 pl-6 list-disc';
        } else if (element.tagName === 'LI') {
          element.className = 'mb-2';
        } else if (element.tagName === 'A') {
          element.className = 'text-blue-600 hover:underline';
        } else if (element.tagName === 'PRE') {
          const code = element.querySelector('code');
          if (code) {
            const language = code.className.replace('language-', '');
            const codeBlock = document.createElement('div');
            codeBlock.innerHTML = ReactDOMServer.renderToString(
              <CodeBlock language={language}>{code.textContent}</CodeBlock>
            );
            element.parentNode.replaceChild(codeBlock, element);
          } else {
            element.className = 'bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-4 overflow-x-auto';
          }
        } else if (element.tagName === 'CODE') {
          if (element.parentNode.tagName !== 'PRE') {
            element.className = 'font-mono text-sm bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded';
          }
        } else if (element.tagName === 'TABLE') {
          element.className = 'w-full mb-4 border-collapse';
        } else if (element.tagName === 'TH' || element.tagName === 'TD') {
          element.className = 'border border-gray-300 dark:border-gray-700 px-4 py-2';
        } else if (element.tagName === 'TH') {
          element.className += ' bg-gray-100 dark:bg-gray-800 font-semibold';
        }
  
        for (let child of element.children) {
          applyStyles(child);
        }
      };
    
      applyStyles(doc.body);
      setParsedContent(doc.body.innerHTML);
    };

    renderContent();
  }, [content])

  return (
    <motion.div 
      className="flex-1 px-4 sm:px-6 lg:px-8 pb-24 mx-auto max-w-4xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <article className="prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
      </article>
      
      {showScrollToTop && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-8 right-8"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  size="icon"
                  className="rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <ChevronUp className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Scroll to top</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </motion.div>
      )}
    </motion.div>
  )
}

const CodeBlock = ({ children, language }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <SyntaxHighlighter 
        language={language} 
        style={tomorrow}
        customStyle={{
          padding: '1.25rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          lineHeight: '1.5',
        }}
      >
        {children}
      </SyntaxHighlighter>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 h-8 w-8 rounded-md bg-background/80"
              onClick={copyToClipboard}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-gray-500" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{copied ? 'Copied!' : 'Copy code'}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

export default MainContent