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
  title = 'Akiradocs',
  description = 'Next-gen documentation powered by AI',
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
            alt={`${title} logo`}
            width={logo.width}
            height={logo.height}
            className="relative rounded-full" 
       />
        )}
        
          <h1 className="text-5xl font-extrabold text-primary">
            {title}
          </h1>
      </div>

        <p className="text-xl text-muted-foreground mb-8">
          {description}
        </p>

    </motion.div>
  )
}
