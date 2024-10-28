"use client"

import Link from "next/link"
import { BookOpen } from "lucide-react"

export function LegacyDocsToggle() {
  return (
    <Link href="/docs" className="inline-block">
      <button className="group flex items-center space-x-2 px-4 py-2 rounded-md bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 ease-in-out hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:ring-opacity-50">
        <BookOpen className="h-4 w-4 text-gray-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors duration-200" />
        <span className="group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-200">Legacy View</span>
      </button>
    </Link>
  )
}