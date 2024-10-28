"use client"
import { motion } from "framer-motion"
import { Article } from "@/types/Article"
import { ArticleCard } from "./ArticleCard"
import Link from "next/link"

interface RecommendedArticlesProps {
    articles: Article[]
}

export function RecommendedArticles({ articles }: RecommendedArticlesProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h2 className="text-3xl font-semibold mb-6 text-center text-indigo-800 dark:text-indigo-200">
                Recommended Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article, index) => (
                    <ArticleCard key={index} article={article} index={index} />
                ))}
            </div>
            <div className="mt-6 text-center">
                <Link 
                    href="/articles" 
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
                >
                    View all articles →
                </Link>
            </div>
        </motion.div>
    )
}
