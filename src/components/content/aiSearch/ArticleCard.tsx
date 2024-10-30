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
            <Card className="h-full shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border-border">
                <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors duration-300">
                        {article.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">{article.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow"></CardContent>
                <CardContent className="pt-0">
                    <Button variant="link" className="p-0 text-primary hover:text-primary/80" onClick={handleReadMore}>
                        Read More <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1 duration-300" />
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    )
}