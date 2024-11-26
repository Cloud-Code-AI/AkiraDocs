import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ArticleCardProps {
  title: string
  description: string
  author: string
  publishDate: string
  slug: string
  locale: string
  type: string
  imageUrl?: string
}

export function ArticleCard({ title, description, author, publishDate, slug, locale, type, imageUrl }: ArticleCardProps) {
  return (
    <Card className="flex flex-col h-full">
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-t-lg"
          />
        </div>
      )}
      <CardHeader>
        <CardTitle className="text-xl font-bold">
          <Link href={`/${locale}/${type}/${slug}`} className="hover:underline">
            {title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="secondary">{author}</Badge>
        <span className="text-sm text-muted-foreground">{new Date(publishDate).toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  )
}
