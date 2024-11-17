export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: Date;
  description: string;
}

export interface ArticleCardProps {
  article: Article
  index: number
}

export interface RecommendedArticlesProps {
  articles: Article[]
}