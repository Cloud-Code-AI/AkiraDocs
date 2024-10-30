"use client"
import { motion } from "framer-motion"
import Image from "next/image"

interface SearchHeaderProps {
  logo?: {
    path: string;
    width: number;
    height: number;
    show: boolean;
  };
  title?: {
    text: string;
    show: boolean;
  };
  description?: {
    text: string;
    show: boolean;
  };
}

export function SearchHeader({
  logo = {
    path: '/akiradocs_logo.svg',
    width: 200,
    height: 50,
    show: true
  },
  title = {
    text: '',
    show: false
  },
  description = {
    text: 'Next-gen documentation powered by AI',
    show: true
  }
}: SearchHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mb-4">
        {logo.show && (
          <Image 
            src={logo.path}
            alt="Logo"
            width={logo.width}
            height={logo.height}
            className="mx-auto"
          />
        )}
        {title.show && (
          <h1 className="text-5xl font-extrabold text-primary">
            {title.text}
          </h1>
        )}
      </div>
      {description.show && (
        <p className="text-xl text-muted-foreground mb-8">
          {description.text}
        </p>
      )}
    </motion.div>
  )
}
