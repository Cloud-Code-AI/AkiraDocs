import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Article } from "@/types/Article"

interface ArticleCardProps {
    article: Article
    index: number
}

export function ArticleCard({ article, index }: ArticleCardProps) {
    const handleReadMore = () => {
        window.location.href = `/${article.context}/${article.id}`
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
        >
            <Card className="h-full shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border-indigo-100 dark:border-indigo-800">
                <CardHeader>
                    <CardTitle className="text-lg group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                        {article.title}
                    </CardTitle>
                    <CardDescription>{article.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow"></CardContent>
                <CardContent className="pt-0">
                    <Button variant="link" className="p-0 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-200" onClick={handleReadMore}>
                        Read More <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}