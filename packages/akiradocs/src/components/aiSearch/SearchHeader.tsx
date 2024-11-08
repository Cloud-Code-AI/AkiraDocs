"use client"
import IconSVG from "@/components/ui/iconSVG";
import { motion } from "framer-motion"
import { SearchConfig } from "@/types/config";


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
}: SearchConfig) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mb-4">
        {logo.show && (
          <IconSVG 
            src={logo.path} 
            alt={`${title.text} logo`}
            width={logo.width}
            height={logo.height}
            className="relative rounded-full" 
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
