'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { Button } from "@/components/ui/button"

// Define the structure for social links
interface SocialLink {
  name: string;
  url: string;
  icon: string; // This will be the path to the PNG file
}

// Define the props for the Footer component
interface FooterProps {
  companyName: string;
  socialLinks: SocialLink[];
  madeWithLove?: boolean;
}

const Footer: React.FC<FooterProps> = ({ companyName, socialLinks, madeWithLove = true }) => {
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
              <span>© {currentYear} {companyName}. All rights reserved.</span>
              {madeWithLove && (
                <>
                  <span>|</span>
                  <span>Made with <Heart className="inline-block w-4 h-4 text-red-500" /> by the {companyName} team</span>
                </>
              )}
            </div>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" asChild className="rounded-full bg-muted/50 hover:bg-muted transition-colors">
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <Image 
                        src={link.icon} 
                        alt={link.name} 
                        width={20} 
                        height={20}
                      />
                      <span className="sr-only">{link.name}</span>
                    </a>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer