"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"
import { getAkiradocsConfig } from "@/lib/getAkiradocsConfig"


export function LegacyDocsToggle() {
  const config = getAkiradocsConfig()
  return (
    <Link href={`/${config.localization.defaultLocale}/docs`} className="inline-block">
      <button className="group flex items-center space-x-2 px-4 py-2 rounded-md bg-accent hover:bg-accent/80 text-sm font-medium text-accent-foreground border border-border shadow-sm hover:shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-opacity-50">
        <BookOpen className="h-4 w-4 text-accent-foreground/80 group-hover:text-accent-foreground transition-colors duration-200" />
        <span className="group-hover:text-accent-foreground transition-colors duration-200">Legacy View</span>
      </button>
    </Link>
  )
}